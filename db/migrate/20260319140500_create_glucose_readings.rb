class CreateGlucoseReadings < ActiveRecord::Migration[8.1]
  def change
    create_table :glucose_readings do |t|
      t.integer :value, null: false
      t.datetime :measured_at, null: false
      t.string :context, null: false
      t.text :notes

      t.timestamps
    end

    add_index :glucose_readings, :measured_at
    add_index :glucose_readings, :context
  end
end
