class User < ApplicationRecord
  # Modele central : comptes patient, soignant clinique et admin (pilotage plateforme).
  ROLES = %w[patient clinician admin].freeze

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
  normalizes :name, with: ->(name) { name.to_s.squish.presence }

  validates :role, inclusion: { in: ROLES }
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 8 }, if: -> { password.present? }

  # Nom affiche par defaut a l'inscription si le champ est vide (derive de l'email).
  before_validation :assign_default_name
  after_create_commit :ensure_patient_profile!

  scope :patients, -> { where(role: "patient") }
  scope :clinicians, -> { where(role: "clinician") }
  scope :admins, -> { where(role: "admin") }

  def current_patient_profile
    patient_profile || build_patient_profile
  end

  def patient?
    role == "patient"
  end

  def clinician?
    role == "clinician"
  end

  def admin?
    role == "admin"
  end

  # Jeton signe temporaire pour le lien « mot de passe oublie » (pas de colonne en base).
  def password_reset_token
    signed_id(purpose: "password_reset", expires_in: 30.minutes)
  end

  # Retrouve l'utilisateur a partir du parametre d'URL ; nil si expire ou falsifie.
  def self.find_by_password_reset_token(token)
    find_signed(token, purpose: "password_reset")
  rescue ActiveSupport::MessageVerifier::InvalidSignature
    nil
  end

  private

  def assign_default_name
    return if name.present?
    return if email.blank?

    local_part = email.to_s.split("@").first.to_s.tr("._-", " ").squish
    self.name = local_part.present? ? local_part.split.map(&:capitalize).join(" ") : "Utilisateur DiabetCare"
  end

  # Cree le profil glycemique par defaut des la creation d'un compte patient.
  def ensure_patient_profile!
    create_patient_profile! if patient? && !patient_profile
  end
end
