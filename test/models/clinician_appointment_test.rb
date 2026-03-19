require "test_helper"

class ClinicianAppointmentTest < ActiveSupport::TestCase
  test "requires a clinician and a patient with the right roles" do
    appointment = ClinicianAppointment.new(
      clinician: users(:demo),
      patient: users(:clinician),
      starts_at: Time.zone.now + 1.hour,
      appointment_type: "follow_up",
      status: "scheduled",
      reason: "Invalid role setup"
    )

    assert_not appointment.valid?
    assert_includes appointment.errors[:clinician], "doit etre un soignant"
    assert_includes appointment.errors[:patient], "doit etre un patient"
  end

  test "formats mockup labels from persisted data" do
    appointment = clinician_appointments(:demo_follow_up)

    assert_equal "Aujourd'hui", appointment.day_label
    assert_equal "16:30", appointment.time_label
    assert_equal "A preparer", appointment.mockup_status_label
    assert_equal "Teleconsultation", appointment.mockup_type_label
  end
end
