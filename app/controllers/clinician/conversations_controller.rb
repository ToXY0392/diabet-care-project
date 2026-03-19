module Clinician
  class ConversationsController < BaseController
    # Endpoint JSON des fils de discussion clinician <-> patient.
    before_action :set_conversation, only: %i[show mark_read]

    def index
      conversations = current_clinician.clinician_conversations_as_clinician.includes(:patient, :clinician_messages).recent_first
      render json: conversations.map { |conversation| serialize_conversation(conversation, include_messages: false) }
    end

    def show
      render json: serialize_conversation(@conversation, include_messages: true)
    end

    def create
      conversation = current_clinician.clinician_conversations_as_clinician.new(conversation_params)

      if conversation.save
        if params[:initial_message_body].present?
          conversation.clinician_messages.create!(author: current_clinician, body: params[:initial_message_body], sent_at: Time.zone.now)
        end

        render json: serialize_conversation(conversation, include_messages: true), status: :created
      else
        render json: { errors: conversation.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def mark_read
      participant = @conversation.participant_for(current_clinician)
      participant&.mark_read!
      render json: serialize_conversation(@conversation.reload, include_messages: true)
    end

    private

    def set_conversation
      @conversation = current_clinician.clinician_conversations_as_clinician.includes(:patient, :clinician_messages).find(params[:id])
    end

    def conversation_params
      params.require(:clinician_conversation).permit(:patient_id, :subject, :status)
    end

    def serialize_conversation(conversation, include_messages:)
      payload = {
        id: conversation.id,
        patient_id: conversation.patient_id,
        patient_name: conversation.patient.name,
        subject: conversation.subject,
        status: conversation.status,
        unread_count: conversation.participant_for(current_clinician)&.unread_count.to_i,
        last_message_preview: conversation.last_message_preview,
        last_message_at: conversation.last_message_at&.iso8601
      }

      if include_messages
        payload[:messages] = conversation.clinician_messages.chronological.map do |message|
          {
            id: message.id,
            author_id: message.author_id,
            author_name: message.author.name,
            author_role: message.author_role_label,
            body: message.body,
            sent_at: message.sent_at.iso8601
          }
        end
      end

      payload
    end
  end
end
