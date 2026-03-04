# frozen_string_literal: true

# Pages statiques et fonctionnalités RGPD.
# home et privacy sont accessibles sans connexion.
class PagesController < ApplicationController
  # Page d'accueil publique (landing)
  def home
  end

  # Politique de confidentialité RGPD
  def privacy
  end

  # RGPD Art. 15 - Droit d'accès : export de toutes les données en JSON
  def data_export
    data = {
      user: { email: current_user.email },
      glucose_readings: current_user.glucose_readings.order(:recorded_at).map { |r| { value: r.value, recorded_at: r.recorded_at, source: r.source } },
      meals: current_user.meals.order(:recorded_at).map { |m| { glucose: m.glucose, carbs: m.carbs, bolus: m.bolus, recorded_at: m.recorded_at, meal_type: m.meal_type } },
      target: current_user.target ? { min: current_user.target.min_glucose, max: current_user.target.max_glucose } : nil
    }
    send_data data.to_json, filename: "diabetcare_export_#{Date.current}.json", type: "application/json"
  end

  # RGPD Art. 17 - Droit à l'effacement : suppression complète du compte et des données
  def delete_account
    current_user.destroy
    session.delete(:user_id)
    redirect_to login_path, notice: "Votre compte et vos données ont été supprimés."
  end
end
