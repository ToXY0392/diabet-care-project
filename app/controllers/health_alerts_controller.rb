class HealthAlertsController < ApplicationController
  def index
    @health_alerts = current_user.health_alerts.recent_first.includes(:glucose_reading, :medication_reminder)
  end

  def notifications_feed
    alerts = current_user.health_alerts.unread.unnotified.recent_first.limit(5)
    alerts.update_all(browser_notified_at: Time.zone.now) if alerts.any?

    render json: alerts.map { |alert| serialize_alert(alert) }
  end

  def mark_read
    current_user.health_alerts.find(params[:id]).update!(read_at: Time.zone.now)
    redirect_back fallback_location: health_alerts_path, notice: "Alerte marquee comme lue."
  end

  def acknowledge
    current_user.health_alerts.find(params[:id]).update!(acknowledged_at: Time.zone.now)
    redirect_back fallback_location: health_alerts_path, notice: "Alerte accusee."
  end

  def resolve
    current_user.health_alerts.find(params[:id]).update!(resolved_at: Time.zone.now, read_at: Time.zone.now)
    redirect_back fallback_location: health_alerts_path, notice: "Alerte resolue."
  end

  def mark_all_read
    current_user.health_alerts.unread.update_all(read_at: Time.zone.now)
    redirect_back fallback_location: health_alerts_path, notice: "Toutes les alertes ont ete marquees comme lues."
  end

  private

  def serialize_alert(alert)
    {
      id: alert.id,
      title: alert_title(alert),
      body: alert.message,
      severity: alert.severity,
      detected_at: alert.detected_at.iso8601
    }
  end

  def alert_title(alert)
    {
      "hypoglycemia" => "Alerte hypoglycemie",
      "hyperglycemia" => "Alerte hyperglycemie",
      "medication_overdue" => "Traitement en retard",
      "medication_missed" => "Traitement manque"
    }.fetch(alert.alert_type, "Alerte de sante")
  end
end
