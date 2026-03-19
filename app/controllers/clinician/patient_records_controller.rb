module Clinician
  class PatientRecordsController < BaseController
    before_action :set_patient_and_record, only: %i[show update]

    def show
      render json: serialize_record(@patient, @record)
    end

    def create
      patient = clinician_patient_scope.find(patient_record_params.fetch(:patient_id))
      record = patient.clinician_patient_profile || patient.build_clinician_patient_profile

      update_patient_and_record!(patient, record)
      render json: serialize_record(patient, record), status: :created
    rescue ActiveRecord::RecordInvalid => e
      render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
    end

    def update
      update_patient_and_record!(@patient, @record)
      render json: serialize_record(@patient, @record)
    rescue ActiveRecord::RecordInvalid => e
      render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
    end

    private

    def set_patient_and_record
      @record = ClinicianPatientProfile.find(params[:id])
      @patient = clinician_patient_scope.find(@record.patient_id)
    end

    def update_patient_and_record!(patient, record)
      ActiveRecord::Base.transaction do
        patient.update!(name: patient_record_params[:name], email: patient_record_params[:email])
        record.update!(record_attributes.merge(patient:))
      end
    end

    def patient_record_params
      params.require(:patient_record).permit(:patient_id, :name, :email, :sex, :age, :height, :weight, :diagnosis, :treatment, :ordonnance, :phone, :contact)
    end

    def record_attributes
      patient_record_params.slice(:sex, :age, :height, :weight, :diagnosis, :treatment, :ordonnance, :phone, :contact)
    end

    def serialize_record(patient, record)
      {
        id: record.id,
        patient_id: patient.id,
        name: patient.name,
        email: patient.email,
        sex: record.sex,
        age: record.age,
        height: record.height,
        weight: record.weight,
        diagnosis: record.diagnosis,
        treatment: record.treatment,
        ordonnance: record.ordonnance,
        phone: record.phone,
        contact: record.contact
      }
    end
  end
end
