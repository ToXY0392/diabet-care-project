# frozen_string_literal: true

class CreateMeals < ActiveRecord::Migration[8.1]
  def change
    create_table :meals do |t|
      t.references :user, null: false, foreign_key: true
      t.decimal :carbs, precision: 6, scale: 2
      t.decimal :bolus, precision: 5, scale: 2
      t.datetime :recorded_at, null: false
      t.string :meal_type
      t.text :notes

      t.timestamps
    end

    add_index :meals, [:user_id, :recorded_at]
  end
end
