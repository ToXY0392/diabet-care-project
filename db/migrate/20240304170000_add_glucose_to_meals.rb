# frozen_string_literal: true

class AddGlucoseToMeals < ActiveRecord::Migration[8.1]
  def change
    add_column :meals, :glucose, :decimal, precision: 5, scale: 2
  end
end
