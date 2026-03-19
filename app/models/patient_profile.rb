class PatientProfile < ApplicationRecord
  # Stocke les seuils glycemiques et preferences propres a un patient.
  belongs_to :user

  validates :hypo_threshold, :hyper_threshold, :hypo_critical_threshold, :hyper_critical_threshold,
            :glucose_target_low, :glucose_target_high, presence: true
  validates :hypo_threshold, :hyper_threshold, :hypo_critical_threshold, :hyper_critical_threshold,
            :glucose_target_low, :glucose_target_high, numericality: { greater_than: 0 }
  validate :target_range_is_ordered
  validate :alert_thresholds_are_ordered

  private

  def target_range_is_ordered
    return if glucose_target_low < glucose_target_high

    errors.add(:glucose_target_high, "doit etre superieur a la borne basse")
  end

  def alert_thresholds_are_ordered
    errors.add(:hypo_threshold, "doit etre superieur ou egal au seuil critique") if hypo_threshold < hypo_critical_threshold
    errors.add(:hyper_threshold, "doit etre inferieur ou egal au seuil critique") if hyper_threshold > hyper_critical_threshold
  end
end
