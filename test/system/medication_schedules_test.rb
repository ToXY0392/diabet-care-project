require "application_system_test_case"

class MedicationSchedulesTest < ApplicationSystemTestCase
  test "creates a recurring medication schedule" do
    sign_in_as(users(:demo))

    visit medication_schedules_path
    click_on "Nouveau programme"
    fill_in "Nom du traitement", with: "Basale"
    fill_in "Dosage", with: "14 unites"
    fill_in "Heures de prise (format 08:00, 20:00)", with: "07:00,22:00"
    check "Monday"
    click_on "Enregistrer"

    assert_text "Programme de traitement cree."
    assert_text "Basale"
  end
end
