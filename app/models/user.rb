class User < ApplicationRecord
  ROLES = %w[patient clinician].freeze

  has_secure_password

  has_many :clinical_notes_as_clinician, class_name: "ClinicalNote", foreign_key: :clinician_id, dependent: :destroy
  has_many :clinical_notes_as_patient, class_name: "ClinicalNote", foreign_key: :patient_id, dependent: :destroy
  has_one :clinician_patient_profile, foreign_key: :patient_id, dependent: :destroy
  has_many :clinician_appointments_as_clinician, class_name: "ClinicianAppointment", foreign_key: :clinician_id, dependent: :destroy
  has_many :clinician_appointments_as_patient, class_name: "ClinicianAppointment", foreign_key: :patient_id, dependent: :destroy
  has_many :clinician_conversation_participants, dependent: :destroy
  has_many :clinician_conversations, through: :clinician_conversation_participants
  has_many :clinician_conversations_as_clinician, class_name: "ClinicianConversation", foreign_key: :clinician_id, dependent: :destroy
  has_many :clinician_conversations_as_patient, class_name: "ClinicianConversation", foreign_key: :patient_id, dependent: :destroy
  has_many :clinician_messages, foreign_key: :author_id, dependent: :destroy
  has_many :coordination_notes, foreign_key: :clinician_id, dependent: :destroy
  has_one :dexcom_connection, dependent: :destroy
  has_one :patient_profile, dependent: :destroy
  has_many :glucose_readings, dependent: :destroy
  has_many :health_alerts, dependent: :destroy
  has_many :journal_entries, dependent: :destroy
  has_many :meals, dependent: :destroy
  has_many :medication_schedules, dependent: :destroy
  has_many :medication_reminders, dependent: :destroy

  normalizes :email, with: ->(email) { email.strip.downcase }

  validates :role, inclusion: { in: ROLES }
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 8 }, if: -> { password.present? }

  after_create_commit :ensure_patient_profile!

  scope :patients, -> { where(role: "patient") }
  scope :clinicians, -> { where(role: "clinician") }

  def current_patient_profile
    patient_profile || build_patient_profile
  end

  def patient?
    role == "patient"
  end

  def clinician?
    role == "clinician"
  end

  private

  def ensure_patient_profile!
    create_patient_profile! if patient? && !patient_profile
  end
end
