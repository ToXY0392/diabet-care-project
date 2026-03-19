class CreateMedicationReminders < ActiveRecord::Migration[8.1]
  def change
    create_table :medication_reminders do |t|
      t.references :user, null: false, foreign_key: true
      t.string :medication_name, null: false
      t.string :dosage, null: false
      t.datetime :scheduled_at, null: false
      t.datetime :taken_at
      t.text :instructions

      t.timestamps
    end

    add_index :medication_reminders, :scheduled_at
  end
end
