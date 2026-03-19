require "test_helper"

class MedicationScheduleTest < ActiveSupport::TestCase
  test "syncs recurring reminders for enabled weekdays" do
    schedule = medication_schedules(:metformin)

    assert_difference("MedicationReminder.count", 5) do
      schedule.sync_reminders!(from: Date.current, to: Date.current + 2.days)
    end

    assert_equal 2, schedule.medication_reminders.where(scheduled_at: Time.zone.today.all_day).count
  end

  test "requires at least one active weekday" do
    schedule = medication_schedules(:metformin)
    schedule.sunday_enabled = false
    schedule.monday_enabled = false
    schedule.tuesday_enabled = false
    schedule.wednesday_enabled = false
    schedule.thursday_enabled = false
    schedule.friday_enabled = false
    schedule.saturday_enabled = false

    assert_not schedule.valid?
    assert_includes schedule.errors[:weekdays_mask], "doit activer au moins un jour"
  end
end
