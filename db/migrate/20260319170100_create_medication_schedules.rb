class CreateMedicationSchedules < ActiveRecord::Migration[8.1]
  def change
    create_table :medication_schedules do |t|
      t.references :user, null: false, foreign_key: true
      t.string :medication_name, null: false
      t.string :dosage, null: false
      t.text :instructions
      t.date :starts_on, null: false
      t.date :ends_on
      t.integer :weekdays_mask, null: false, default: 127
      t.text :reminder_times, null: false
      t.boolean :active, null: false, default: true

      t.timestamps
    end

    add_index :medication_schedules, :active
  end
end
