require "test_helper"

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  driven_by :rack_test

  private

  def sign_in_as(user, password: "password123")
    visit new_session_path
    fill_in "Email", with: user.email
    fill_in "Mot de passe", with: password
    click_on "Se connecter"
  end
end
