class ClinicianConversation < ApplicationRecord
  # Fil de discussion persistant entre un clinician et un patient.
  STATUSES = %w[active archived closed].freeze

  belongs_to :clinician, class_name: "User"
  belongs_to :patient, class_name: "User"
  has_many :clinician_conversation_participants, dependent: :destroy
  has_many :clinician_messages, dependent: :destroy

  validates :status, inclusion: { in: STATUSES }
  validate :clinician_must_have_clinician_role
  validate :patient_must_have_patient_role

  scope :recent_first, -> { order(last_message_at: :desc, updated_at: :desc) }

  after_create :ensure_participants!

  def latest_message
    clinician_messages.order(sent_at: :desc, created_at: :desc).first
  end

  def sync_last_message_metadata!
    message = latest_message

    update!(
      last_message_preview: message&.body.to_s.tr("\n", " ").squish.presence,
      last_message_at: message&.sent_at
    )
  end

  def participant_for(user)
    clinician_conversation_participants.find_by(user:)
  end

  def ensure_participants!
    clinician_conversation_participants.find_or_create_by!(user: clinician) do |participant|
      participant.role = "clinician"
    end

    clinician_conversation_participants.find_or_create_by!(user: patient) do |participant|
      participant.role = "patient"
    end
  end

  private

  def clinician_must_have_clinician_role
    errors.add(:clinician, "doit etre un soignant") unless clinician&.clinician?
  end

  def patient_must_have_patient_role
    errors.add(:patient, "doit etre un patient") unless patient&.patient?
  end
end
