class ClinicianConversationParticipant < ApplicationRecord
  ROLES = %w[clinician patient].freeze

  belongs_to :clinician_conversation
  belongs_to :user

  validates :role, inclusion: { in: ROLES }
  validates :user_id, uniqueness: { scope: :clinician_conversation_id }
  validate :role_matches_user

  scope :with_unread, -> { where("unread_count > 0") }

  def mark_read!
    update!(unread_count: 0, last_read_at: Time.zone.now)
  end

  private

  def role_matches_user
    return if user.blank?
    return if role == "clinician" && user.clinician?
    return if role == "patient" && user.patient?

    errors.add(:role, "ne correspond pas au role utilisateur")
  end
end
