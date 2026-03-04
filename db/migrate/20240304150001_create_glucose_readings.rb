# frozen_string_literal: true

class CreateGlucoseReadings < ActiveRecord::Migration[8.1]
  def change
    create_table :glucose_readings do |t|
      t.references :user, null: false, foreign_key: true
      t.decimal :value, precision: 5, scale: 2, null: false
      t.string :trend
      t.datetime :recorded_at, null: false
      t.string :source, default: "manual", null: false

      t.timestamps
    end

    add_index :glucose_readings, [:user_id, :recorded_at]
  end
end
