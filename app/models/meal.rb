class Meal < ApplicationRecord
  # Les repas servent a contextualiser les variations glycemiques du patient.
  belongs_to :user

  validates :name, presence: true
  validates :carbs, presence: true, numericality: { greater_than_or_equal_to: 0, less_than: 500 }
  validates :eaten_at, presence: true

  scope :recent_first, -> { order(eaten_at: :desc) }
  scope :for_today, -> { where(eaten_at: Time.zone.today.all_day) }
end
