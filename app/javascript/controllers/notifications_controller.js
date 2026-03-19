import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["status"]
  static values = { feedUrl: String, enabled: Boolean }

  connect() {
    if (this.hasEnabledValue && !this.enabledValue) {
      this.updateStatus("Notifications navigateur desactivees dans votre profil sante.")
      return
    }

    if (!("Notification" in window) || !this.hasFeedUrlValue) {
      this.updateStatus("Notifications navigateur indisponibles.")
      return
    }

    this.updateStatus(this.statusMessage())

    if (Notification.permission === "granted") {
      this.checkAlerts()
      this.startPolling()
    }
  }

  disconnect() {
    this.stopPolling()
  }

  async requestPermission() {
    if (!("Notification" in window)) {
      this.updateStatus("Ce navigateur ne supporte pas les notifications.")
      return
    }

    const permission = await Notification.requestPermission()
    this.updateStatus(this.statusMessage(permission))

    if (permission === "granted") {
      this.checkAlerts()
      this.startPolling()
    }
  }

  async checkAlerts() {
    if (Notification.permission !== "granted") return

    const response = await fetch(this.feedUrlValue, {
      headers: { Accept: "application/json" }
    })

    if (!response.ok) return

    const alerts = await response.json()

    alerts.forEach((alert) => {
      const notification = new Notification(alert.title, {
        body: alert.body,
        tag: `health-alert-${alert.id}`
      })

      notification.onclick = () => {
        window.focus()
        window.location.href = "/health_alerts"
      }
    })
  }

  startPolling() {
    if (this.pollHandle) return

    this.pollHandle = window.setInterval(() => this.checkAlerts(), 60000)
  }

  stopPolling() {
    if (!this.pollHandle) return

    window.clearInterval(this.pollHandle)
    this.pollHandle = null
  }

  updateStatus(message) {
    if (this.hasStatusTarget) {
      this.statusTarget.textContent = message
    }
  }

  statusMessage(permission = Notification.permission) {
    if (permission === "granted") return "Notifications navigateur actives."
    if (permission === "denied") return "Notifications navigateur refusees."

    return "Activez les notifications pour recevoir les alertes hypo/hyper hors de l'app."
  }
}
