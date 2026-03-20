require "application_system_test_case"

class AuthenticationTest < ApplicationSystemTestCase
  test "starts on role select then login and allows patient sign in" do
    visit root_path

    assert_text "Comment souhaitez-vous acceder"
    click_on "Je suis patient"

    assert_current_path login_path
    assert_text "Acceder a votre espace patient"

    visit home_path

    assert_text "Centralisez le suivi diabetique"
    assert_text "Compte admin demo"

    visit dashboard_path

    assert_current_path root_path

    sign_in_as(users(:demo))

    assert_current_path dashboard_path
    assert_text "DiaCare"
    assert_text "Demo Patient"
    assert_text "Vue patient"
  end

  test "allows an admin to sign in and reach the admin dashboard" do
    sign_in_as(users(:admin))

    assert_current_path admin_dashboard_path
    assert_text "Dashboard admin"
    assert_text "Pilotage plateforme"
  end
end
