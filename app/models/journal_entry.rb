class JournalEntry < ApplicationRecord
  # Espace libre pour relier ressenti, activite et symptomes aux donnees sante.
  MOODS = %w[low neutral good great].freeze

  belongs_to :user

  validates :recorded_at, presence: true
  validates :mood, inclusion: { in: MOODS }
  validates :activity_minutes, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
end
