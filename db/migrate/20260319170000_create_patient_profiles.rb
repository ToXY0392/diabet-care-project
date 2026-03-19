class CreatePatientProfiles < ActiveRecord::Migration[8.1]
  class MigrationUser < ApplicationRecord
    self.table_name = "users"
  end

  def up
    create_table :patient_profiles do |t|
      t.references :user, null: false, foreign_key: true, index: { unique: true }
      t.integer :hypo_threshold, null: false, default: 70
      t.integer :hyper_threshold, null: false, default: 180
      t.integer :hypo_critical_threshold, null: false, default: 54
      t.integer :hyper_critical_threshold, null: false, default: 250
      t.integer :glucose_target_low, null: false, default: 70
      t.integer :glucose_target_high, null: false, default: 180
      t.boolean :browser_notifications_enabled, null: false, default: true

      t.timestamps
    end

    MigrationUser.find_each do |user|
      execute <<~SQL.squish
        INSERT INTO patient_profiles
          (user_id, hypo_threshold, hyper_threshold, hypo_critical_threshold, hyper_critical_threshold,
           glucose_target_low, glucose_target_high, browser_notifications_enabled, created_at, updated_at)
        VALUES
          (#{user.id}, 70, 180, 54, 250, 70, 180, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      SQL
    end
  end

  def down
    drop_table :patient_profiles
  end
end
