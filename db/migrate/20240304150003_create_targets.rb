# frozen_string_literal: true

class CreateTargets < ActiveRecord::Migration[8.1]
  def change
    create_table :targets do |t|
      t.references :user, null: false, foreign_key: true
      t.decimal :min_glucose, precision: 5, scale: 2, default: 70
      t.decimal :max_glucose, precision: 5, scale: 2, default: 180

      t.timestamps
    end
  end
end
