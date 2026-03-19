require "test_helper"

class HealthAlertGenerationTest < ActiveSupport::TestCase
  test "creates a hypoglycemia alert for a low reading" do
    user = users(:demo)

    assert_difference("HealthAlert.count", 1) do
      user.glucose_readings.create!(
        value: 62,
        measured_at: Time.zone.now,
        context: "cgm",
        source: "manual",
        notes: "Low reading"
      )
    end

    alert = HealthAlert.order(:created_at).last
    assert_equal "hypoglycemia", alert.alert_type
    assert_equal "warning", alert.severity
  end

  test "uses patient profile thresholds" do
    user = users(:demo)
    user.patient_profile.update!(hypo_threshold: 80, hypo_critical_threshold: 60)

    assert_difference("HealthAlert.count", 1) do
      user.glucose_readings.create!(
        value: 78,
        measured_at: Time.zone.now + 10.minutes,
        context: "fasting",
        source: "manual",
        notes: "Below personalized threshold"
      )
    end

    assert_equal "hypoglycemia", HealthAlert.order(:created_at).last.alert_type
  end

  test "deduplicates repeated alerts inside the time window" do
    user = users(:demo)

    assert_difference("HealthAlert.count", 1) do
      user.glucose_readings.create!(value: 62, measured_at: Time.zone.now, context: "cgm", source: "manual", notes: "Low")
      user.glucose_readings.create!(value: 60, measured_at: Time.zone.now + 5.minutes, context: "cgm", source: "manual", notes: "Low again")
    end
  end

  test "does not create an alert for an in-range reading" do
    user = users(:demo)

    assert_no_difference("HealthAlert.count") do
      user.glucose_readings.create!(
        value: 118,
        measured_at: Time.zone.now,
        context: "fasting",
        source: "manual",
        notes: "Stable reading"
      )
    end
  end
end
