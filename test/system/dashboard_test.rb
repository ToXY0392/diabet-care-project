require "application_system_test_case"

class DashboardTest < ApplicationSystemTestCase
  test "shows the exact combined patient and clinician mockup for signed in user" do
    sign_in_as(users(:demo))

    assert_text "DiaCare"
    assert_text "Demo Patient"
    assert_text "Courbe glycémie"
    assert_text "demo@example.com"
    assert_text "80-170 mg/dL"
    assert_text "Notifications"
    assert_text "Réglages"
    assert_text "DiaCare 2026"
  end
end
