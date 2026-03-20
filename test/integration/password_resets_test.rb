require "test_helper"

# Couvre le flux mot de passe oublie, l'inscription patient (apres choix de profil) et les redirections.
class PasswordResetsTest < ActionDispatch::IntegrationTest
  test "sends a password reset email for a known account" do
    assert_difference("ActionMailer::Base.deliveries.size", 1) do
      post password_resets_path, params: { email: users(:demo).email }
    end

    assert_redirected_to root_path
    email = ActionMailer::Base.deliveries.last
    assert_equal [users(:demo).email], email.to
    assert_includes email.subject, "Reinitialisation"
    assert_match %r{/password_resets/.+/edit}, email.body.encoded
  end

  test "updates the password from a valid reset link" do
    token = users(:demo).password_reset_token

    patch password_reset_path(token), params: {
      user: {
        password: "newpassword123",
        password_confirmation: "newpassword123"
      }
    }

    assert_redirected_to root_path
    assert users(:demo).reload.authenticate("newpassword123")
  end

  test "rejects an invalid reset token" do
    get edit_password_reset_path("invalid-token")

    assert_redirected_to new_password_reset_path
  end

  test "signup works without requiring a name" do
    post choose_profile_path, params: { role: "patient" }

    assert_difference("User.count", 1) do
      post users_path, params: {
        user: {
          email: "new.patient@example.com",
          password: "password123",
          password_confirmation: "password123"
        }
      }
    end

    user = User.order(:created_at).last
    assert_redirected_to dashboard_path
    assert_equal "New Patient", user.name
  end
end
