require "test_helper"

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  driven_by :rack_test

  private

  def sign_in_as(user, password: "password123")
    visit root_path
    case user.role
    when "patient" then click_on "Je suis patient"
    when "clinician" then click_on "Je suis soignant"
    when "admin" then click_on "Administration"
    else
      raise ArgumentError, "Role non gere pour la connexion systeme: #{user.role.inspect}"
    end
    fill_in "Email", with: user.email
    fill_in "Mot de passe", with: password
    click_on "Se connecter"
  end
end
