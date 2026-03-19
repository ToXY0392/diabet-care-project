module Clinician
  class ClinicalNotesController < BaseController
    # Endpoint JSON des notes cliniques rattachees a un patient suivi.
    before_action :set_clinical_note, only: %i[update destroy]

    def index
      notes = current_clinician.clinical_notes_as_clinician.includes(:patient).recent_first
      render json: notes.map { |note| serialize_note(note) }
    end

    def create
      note = current_clinician.clinical_notes_as_clinician.new(clinical_note_params)

      if note.save
        render json: serialize_note(note), status: :created
      else
        render json: { errors: note.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      if @clinical_note.update(clinical_note_params)
        render json: serialize_note(@clinical_note)
      else
        render json: { errors: @clinical_note.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      @clinical_note.destroy
      head :no_content
    end

    private

    def set_clinical_note
      @clinical_note = current_clinician.clinical_notes_as_clinician.find(params[:id])
    end

    def clinical_note_params
      params.require(:clinical_note).permit(:patient_id, :title, :body, :category, :pinned, :recorded_at)
    end

    def serialize_note(note)
      {
        id: note.id,
        patient_id: note.patient_id,
        patient_name: note.patient.name,
        title: note.title,
        body: note.body,
        category: note.category,
        pinned: note.pinned,
        recorded_at: note.recorded_at.iso8601
      }
    end
  end
end
