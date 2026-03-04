# frozen_string_literal: true

# Objectif glycémique : plage cible en mg/dL (ex: 70-180).
# Utilisé pour le calcul du "temps en cible" dans les rapports.
# Un utilisateur n'a qu'un seul objectif.
class Target < ApplicationRecord
  belongs_to :user

  validates :min_glucose, numericality: { greater_than: 0 }
  validates :max_glucose, numericality: { greater_than: 0 }
  validate :max_greater_than_min

  private

  def max_greater_than_min
    return if max_glucose.blank? || min_glucose.blank?

    errors.add(:max_glucose, "doit être supérieur à min") if max_glucose <= min_glucose
  end
end
