# frozen_string_literal: true

class CreateDexcomSyncLogs < ActiveRecord::Migration[8.1]
  def change
    create_table :dexcom_sync_logs do |t|
      t.references :user, null: false, foreign_key: true
      t.datetime :last_sync_at, null: false
      t.integer :records_imported, default: 0

      t.timestamps
    end
  end
end
