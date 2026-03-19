module Clinician
  class AppointmentsController < BaseController
    before_action :set_appointment, only: %i[update destroy]

    def index
      appointments = current_clinician.clinician_appointments_as_clinician.includes(:patient).recent_first
      render json: appointments.map { |appointment| serialize_appointment(appointment) }
    end

    def create
      appointment = current_clinician.clinician_appointments_as_clinician.new(appointment_params)

      if appointment.save
        render json: serialize_appointment(appointment), status: :created
      else
        render json: { errors: appointment.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      if @appointment.update(appointment_params)
        render json: serialize_appointment(@appointment)
      else
        render json: { errors: @appointment.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      @appointment.destroy
      head :no_content
    end

    private

    def set_appointment
      @appointment = current_clinician.clinician_appointments_as_clinician.find(params[:id])
    end

    def appointment_params
      params.require(:clinician_appointment).permit(:patient_id, :starts_at, :ends_at, :appointment_type, :status, :reason, :preparation_notes)
    end

    def serialize_appointment(appointment)
      {
        id: appointment.id,
        patient_id: appointment.patient_id,
        patient_name: appointment.patient.name,
        starts_at: appointment.starts_at.iso8601,
        ends_at: appointment.ends_at&.iso8601,
        appointment_type: appointment.appointment_type,
        status: appointment.status,
        reason: appointment.reason,
        preparation_notes: appointment.preparation_notes
      }
    end
  end
end
