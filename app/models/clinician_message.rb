class ClinicianMessage < ApplicationRecord
  # Message individuel d'une conversation clinician <-> patient.
  belongs_to :clinician_conversation
  belongs_to :author, class_name: "User"

  validates :body, :sent_at, presence: true
  validate :author_belongs_to_conversation

  scope :chronological, -> { order(:sent_at, :created_at) }

  after_create_commit :refresh_conversation_metadata!
  after_create_commit :increment_unread_for_other_participants!

  def author_role_label
    author.clinician? ? "Clinicien" : "Patient"
  end

  private

  def author_belongs_to_conversation
    return if clinician_conversation.blank? || author.blank?
    return if [clinician_conversation.clinician_id, clinician_conversation.patient_id].include?(author_id)

    errors.add(:author, "doit appartenir a la conversation")
  end

  def refresh_conversation_metadata!
    clinician_conversation.sync_last_message_metadata!
  end

  def increment_unread_for_other_participants!
    # Chaque nouveau message incremente le compteur des autres participants
    # pour que les fils a traiter remontent bien dans l'espace soignant.
    clinician_conversation.clinician_conversation_participants.where.not(user_id: author_id).find_each do |participant|
      participant.update!(unread_count: participant.unread_count + 1)
    end
  end
end
