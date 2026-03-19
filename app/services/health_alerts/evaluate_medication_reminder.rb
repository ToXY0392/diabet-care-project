module HealthAlerts
  class EvaluateMedicationReminder
    # Transforme l'etat d'un rappel de traitement en alerte exploitable par l'UI.
    def self.call(reminder, reference_time: Time.zone.now)
      new(reminder, reference_time: reference_time).call
    end

    def initialize(reminder, reference_time:)
      @reminder = reminder
      @reference_time = reference_time
    end

    def call
      return resolve_related_alerts if @reminder.taken?
      return create_or_refresh_alert!("medication_missed", "critical", missed_message) if @reminder.missed?(@reference_time)
      return create_or_refresh_alert!("medication_overdue", "warning", overdue_message) if @reminder.overdue?(@reference_time)

      nil
    end

    private

    def create_or_refresh_alert!(alert_type, severity, message)
      active_sibling_types(alert_type).update_all(resolved_at: Time.zone.now, updated_at: Time.zone.now)

      alert = HealthAlert.find_or_initialize_by(medication_reminder: @reminder, alert_type: alert_type)
      alert.user = @reminder.user
      alert.severity = severity
      alert.message = message
      alert.detected_at ||= @reference_time
      alert.resolved_at = nil
      alert.save!
      alert
    end

    def resolve_related_alerts
      @reminder.health_alerts.active.update_all(resolved_at: Time.zone.now, updated_at: Time.zone.now)
    end

    def active_sibling_types(current_type)
      @reminder.health_alerts.active.where.not(alert_type: current_type)
    end

    def overdue_message
      "#{@reminder.medication_name} (#{@reminder.dosage}) est en retard depuis #{ApplicationController.helpers.distance_of_time_in_words(@reminder.scheduled_at, @reference_time)}."
    end

    def missed_message
      "#{@reminder.medication_name} (#{@reminder.dosage}) semble manque pour le #{I18n.l(@reminder.scheduled_at, format: :long)}."
    end
  end
end
