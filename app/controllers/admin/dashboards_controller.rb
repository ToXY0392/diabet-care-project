module Admin
  # Tableau de bord d'administration : indicateurs globaux et derniers elements utiles a la soutenance / demo.
  class DashboardsController < BaseController
    def show
      # Compteurs haut niveau pour la grille « dashboard admin » et la demo produit.
      @platform_metrics = [
        { label: "Comptes patients", value: User.patients.count },
        { label: "Comptes soignants", value: User.clinicians.count },
        { label: "Connexions Dexcom", value: DexcomConnection.where(revoked_at: nil).count },
        { label: "Alertes actives", value: HealthAlert.active.count }
      ]

      @recent_users = User.order(created_at: :desc).limit(5)
      @recent_alerts = HealthAlert.includes(:user).recent_first.limit(5)
      @upcoming_appointments = ClinicianAppointment.includes(:patient, :clinician).upcoming.limit(5)
    end
  end
end
