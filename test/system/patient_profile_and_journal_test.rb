require "application_system_test_case"

class PatientProfileAndJournalTest < ApplicationSystemTestCase
  test "updates patient profile thresholds" do
    sign_in_as(users(:demo))

    visit patient_profile_path
    click_on "Modifier"
    fill_in "Seuil hypoglycemie", with: 75
    fill_in "Cible haute", with: 165
    click_on "Enregistrer"

    assert_text "Profil sante mis a jour."
    assert_text "75 mg/dL"
    assert_text "80-165"
  end

  test "creates a journal entry" do
    sign_in_as(users(:demo))

    visit journal_entries_path
    click_on "Nouvelle entree"
    fill_in "Symptomes", with: "Tremblements"
    fill_in "Activite (minutes)", with: 15
    select "Low", from: "Humeur"
    fill_in "Notes", with: "Collation prise apres la marche"
    click_on "Enregistrer"

    assert_text "Entree du journal creee."
    assert_text "Tremblements"
    assert_text "Collation prise apres la marche"
  end
end
