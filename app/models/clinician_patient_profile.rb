class ClinicianPatientProfile < ApplicationRecord
  belongs_to :patient, class_name: "User"

  validates :patient_id, uniqueness: true
  validates :age, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validate :patient_must_have_patient_role

  private

  def patient_must_have_patient_role
    errors.add(:patient, "doit etre un patient") unless patient&.patient?
  end
end
