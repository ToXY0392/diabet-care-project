require "test_helper"

class HealthAlerts::EvaluateMedicationReminderTest < ActiveSupport::TestCase
  test "creates overdue alert for late medication" do
    reminder = medication_reminders(:noon)
    reminder.update!(scheduled_at: 2.hours.ago, taken_at: nil)

    assert_difference("HealthAlert.count", 1) do
      HealthAlerts::EvaluateMedicationReminder.call(reminder, reference_time: Time.zone.now)
    end

    alert = HealthAlert.order(:created_at).last
    assert_equal "medication_overdue", alert.alert_type
    assert_equal reminder, alert.medication_reminder
  end

  test "resolves medication alerts when the dose is taken" do
    reminder = medication_reminders(:noon)
    reminder.update!(scheduled_at: 2.hours.ago, taken_at: nil)
    HealthAlerts::EvaluateMedicationReminder.call(reminder, reference_time: Time.zone.now)
    reminder.update!(taken_at: Time.zone.now + 3.hours)

    HealthAlerts::EvaluateMedicationReminder.call(reminder, reference_time: Time.zone.now + 3.hours)

    assert reminder.health_alerts.last.resolved?
  end
end
