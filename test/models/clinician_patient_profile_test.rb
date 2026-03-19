require "test_helper"

class ClinicianPatientProfileTest < ActiveSupport::TestCase
  test "requires a patient user" do
    profile = ClinicianPatientProfile.new(patient: users(:clinician), age: 40)

    assert_not profile.valid?
    assert_includes profile.errors[:patient], "doit etre un patient"
  end
end
