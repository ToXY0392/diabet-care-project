class ClinicalNote < ApplicationRecord
  # Note clinique rattachee a un patient et saisie par un soignant.
  CATEGORIES = %w[follow_up treatment coordination observation].freeze

  belongs_to :clinician, class_name: "User"
  belongs_to :patient, class_name: "User"

  validates :title, :body, :recorded_at, presence: true
  validates :category, inclusion: { in: CATEGORIES }
  validate :clinician_must_have_clinician_role
  validate :patient_must_have_patient_role

  scope :recent_first, -> { order(recorded_at: :desc, updated_at: :desc) }
  scope :pinned_first, -> { order(pinned: :desc, recorded_at: :desc) }

  private

  def clinician_must_have_clinician_role
    errors.add(:clinician, "doit etre un soignant") unless clinician&.clinician?
  end

  def patient_must_have_patient_role
    errors.add(:patient, "doit etre un patient") unless patient&.patient?
  end
end
