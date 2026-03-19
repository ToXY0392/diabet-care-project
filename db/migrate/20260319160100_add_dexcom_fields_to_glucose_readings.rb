class AddDexcomFieldsToGlucoseReadings < ActiveRecord::Migration[8.1]
  def change
    add_column :glucose_readings, :source, :string, null: false, default: "manual"
    add_column :glucose_readings, :external_id, :string
    add_column :glucose_readings, :trend, :string

    add_index :glucose_readings, %i[user_id source external_id], unique: true
    add_index :glucose_readings, :source
  end
end
