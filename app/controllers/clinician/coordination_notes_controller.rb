module Clinician
  class CoordinationNotesController < BaseController
    # Porte la note de coordination globale visible dans l'espace soignant.
    def show
      note = current_clinician.coordination_notes.active.recent_first.first
      render json: serialize_note(note)
    end

    def create
      note = current_clinician.coordination_notes.new(coordination_note_params)

      if note.save
        render json: serialize_note(note), status: :created
      else
        render json: { errors: note.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      note = current_clinician.coordination_notes.active.recent_first.first || current_clinician.coordination_notes.recent_first.first

      if note&.update(coordination_note_params)
        render json: serialize_note(note)
      else
        render json: { errors: Array(note&.errors&.full_messages).presence || ["Aucune note de coordination disponible."] }, status: :unprocessable_entity
      end
    end

    private

    def coordination_note_params
      params.require(:coordination_note).permit(:title, :body, :active)
    end

    def serialize_note(note)
      return { note: nil } if note.blank?

      {
        id: note.id,
        title: note.title,
        body: note.body,
        active: note.active,
        updated_at: note.updated_at.iso8601
      }
    end
  end
end
