require "test_helper"

class ClinicianMessageTest < ActiveSupport::TestCase
  test "updates conversation metadata and unread count for the other participant" do
    conversation = clinician_conversations(:demo_thread)
    clinician_participant = clinician_conversation_participants(:demo_thread_clinician)
    patient_participant = clinician_conversation_participants(:demo_thread_patient)

    assert_difference("ClinicianMessage.count", 1) do
      conversation.clinician_messages.create!(
        author: users(:demo),
        body: "Je viens d'ajouter mes glycémies.",
        sent_at: Time.zone.now.beginning_of_day + 12.hours + 5.minutes
      )
    end

    assert_equal "Je viens d'ajouter mes glycémies.", conversation.reload.last_message_preview
    assert_equal 2, clinician_participant.reload.unread_count
    assert_equal 0, patient_participant.reload.unread_count
  end
end
