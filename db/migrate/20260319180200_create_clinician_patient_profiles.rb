class CreateClinicianPatientProfiles < ActiveRecord::Migration[8.1]
  def change
    create_table :clinician_patient_profiles do |t|
      t.references :patient, null: false, foreign_key: { to_table: :users }
      t.string :sex
      t.integer :age
      t.string :height
      t.string :weight
      t.string :diagnosis
      t.string :treatment
      t.string :ordonnance
      t.string :phone
      t.string :contact

      t.timestamps
    end
  end
end
