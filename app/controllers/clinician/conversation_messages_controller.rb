module Clinician
  class ConversationMessagesController < BaseController
    def create
      conversation = current_clinician.clinician_conversations_as_clinician.find(params[:conversation_id])
      message = conversation.clinician_messages.new(message_params.merge(author: current_clinician, sent_at: Time.zone.now))

      if message.save
        render json: {
          id: message.id,
          body: message.body,
          author_name: message.author.name,
          author_role: message.author_role_label,
          sent_at: message.sent_at.iso8601
        }, status: :created
      else
        render json: { errors: message.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def message_params
      params.require(:clinician_message).permit(:body)
    end
  end
end
