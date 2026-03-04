# frozen_string_literal: true

# Repas : glucides (g) et bolus insuline (U).
# meal_type = petit-déj, déjeuner, dîner, collation, autre
class Meal < ApplicationRecord
  belongs_to :user

  MEAL_TYPES = %w[breakfast lunch dinner snack other].freeze

  validates :recorded_at, presence: true
  validates :carbs, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :bolus, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :glucose, numericality: { greater_than: 0, less_than: 600 }, allow_nil: true
  validates :meal_type, inclusion: { in: MEAL_TYPES }, allow_nil: true

  scope :recent, -> { order(recorded_at: :desc) }
end
