require "application_system_test_case"

class AuthenticationTest < ApplicationSystemTestCase
  test "redirects guests to login and allows sign in" do
    visit dashboard_path

    assert_current_path new_session_path
    assert_text "Acceder a votre espace"

    sign_in_as(users(:demo))

    assert_current_path dashboard_path
    assert_text "DiaCare"
    assert_text "Demo Patient"
    assert_text "Vue patient"
  end
end
