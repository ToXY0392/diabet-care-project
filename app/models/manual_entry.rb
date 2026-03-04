# frozen_string_literal: true

# Entrée manuelle générique : repas, insuline, activité ou note.
# Note: les repas détaillés (glucides+bolus) sont dans Meal.
# Ce modèle sert pour des entrées simples ou complémentaires.
class ManualEntry < ApplicationRecord
  belongs_to :user

  ENTRY_TYPES = %w[meal insulin activity note].freeze

  validates :entry_type, presence: true, inclusion: { in: ENTRY_TYPES }
  validates :recorded_at, presence: true
  validates :value, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true

  scope :recent, -> { order(recorded_at: :desc) }
end
