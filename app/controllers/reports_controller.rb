# frozen_string_literal: true

# Rapports et graphiques : courbe glycémique + temps en cible.
# Utilise Chartkick pour afficher les graphiques.
class ReportsController < ApplicationController
  def index
    @glucose_readings = current_user.glucose_readings
    target = current_user.target

    # Plage cible pour le calcul du temps en cible (défaut 70-180 mg/dL)
    min = target&.min_glucose || 70
    max = target&.max_glucose || 180

    # Données des 7 derniers jours pour le graphique
    start_date = 7.days.ago
    readings = @glucose_readings.where("recorded_at >= ?", start_date).order(:recorded_at)

    # Format attendu par Chartkick : [[date, valeur], ...]
    @chart_data = readings.map { |r| [r.recorded_at, r.value] }

    # Pourcentage du temps passé dans la plage cible (indicateur clé du suivi diabète)
    in_range = readings.where(value: min..max).count
    total = readings.count
    @time_in_range_pct = total.positive? ? ((in_range.to_f / total) * 100).round(1) : 0
  end
end
