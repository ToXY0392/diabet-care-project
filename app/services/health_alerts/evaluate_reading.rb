module HealthAlerts
  class EvaluateReading
    DEDUP_WINDOW = 30.minutes

    def self.call(reading)
      new(reading).call
    end

    def initialize(reading)
      @reading = reading
      @profile = reading.user.patient_profile || reading.user.create_patient_profile!
    end

    def call
      alert_attributes = build_alert_attributes
      return resolve_active_glucose_alerts if alert_attributes.blank?

      return if duplicate_alert_recently_detected?(alert_attributes[:alert_type])

      HealthAlert.find_or_create_by!(
        glucose_reading: @reading,
        alert_type: alert_attributes[:alert_type]
      ) do |alert|
        alert.user = @reading.user
        alert.severity = alert_attributes[:severity]
        alert.message = alert_attributes[:message]
        alert.detected_at = Time.zone.now
      end
    end

    private

    def build_alert_attributes
      return hypoglycemia_alert if @reading.value < @profile.hypo_threshold
      return hyperglycemia_alert if @reading.value > @profile.hyper_threshold

      nil
    end

    def hypoglycemia_alert
      severity = @reading.value < @profile.hypo_critical_threshold ? "critical" : "warning"

      {
        alert_type: "hypoglycemia",
        severity: severity,
        message: "Hypoglycemie detectee: #{@reading.value} mg/dL (#{@reading.source_label.downcase})."
      }
    end

    def hyperglycemia_alert
      severity = @reading.value > @profile.hyper_critical_threshold ? "critical" : "warning"

      {
        alert_type: "hyperglycemia",
        severity: severity,
        message: "Hyperglycemie detectee: #{@reading.value} mg/dL (#{@reading.source_label.downcase})."
      }
    end

    def duplicate_alert_recently_detected?(alert_type)
      @reading.user.health_alerts.active.where(alert_type: alert_type, medication_reminder_id: nil)
              .where("detected_at >= ?", @reading.measured_at - DEDUP_WINDOW)
              .exists?
    end

    def resolve_active_glucose_alerts
      @reading.user.health_alerts.active.where(alert_type: %w[hypoglycemia hyperglycemia]).update_all(
        resolved_at: Time.zone.now,
        updated_at: Time.zone.now
      )
    end
  end
end
