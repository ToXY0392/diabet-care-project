class AddScheduleToMedicationReminders < ActiveRecord::Migration[8.1]
  def change
    add_reference :medication_reminders, :medication_schedule, foreign_key: true
    add_index :medication_reminders, %i[medication_schedule_id scheduled_at], unique: true
  end
end
