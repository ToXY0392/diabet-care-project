class MakeClinicianPatientProfilesPatientIdUnique < ActiveRecord::Migration[8.1]
  def change
    remove_index :clinician_patient_profiles, :patient_id
    add_index :clinician_patient_profiles, :patient_id, unique: true
  end
end
