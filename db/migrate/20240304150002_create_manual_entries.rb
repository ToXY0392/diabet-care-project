# frozen_string_literal: true

class CreateManualEntries < ActiveRecord::Migration[8.1]
  def change
    create_table :manual_entries do |t|
      t.references :user, null: false, foreign_key: true
      t.string :entry_type, null: false
      t.decimal :value, precision: 8, scale: 2
      t.text :notes
      t.datetime :recorded_at, null: false

      t.timestamps
    end

    add_index :manual_entries, [:user_id, :recorded_at]
  end
end
