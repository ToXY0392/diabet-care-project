# frozen_string_literal: true

# Mesure glycémique : valeur en mg/dL, horodatée.
# source = "dexcom" (import API) ou "manual" (saisie utilisateur)
# trend = tendance du capteur (rising, stable, falling)
class GlucoseReading < ApplicationRecord
  belongs_to :user

  validates :value, presence: true, numericality: { greater_than: 0, less_than: 600 }
  validates :recorded_at, presence: true
  validates :source, inclusion: { in: %w[dexcom manual] }

  scope :from_dexcom, -> { where(source: "dexcom") }
  scope :from_manual, -> { where(source: "manual") }
  scope :in_range, ->(min, max) { where(value: min..max) }
  scope :recent, -> { order(recorded_at: :desc) }
end
