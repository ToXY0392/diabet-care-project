class CreateHealthAlerts < ActiveRecord::Migration[8.1]
  def change
    create_table :health_alerts do |t|
      t.references :user, null: false, foreign_key: true
      t.references :glucose_reading, null: false, foreign_key: true
      t.string :alert_type, null: false
      t.string :severity, null: false
      t.string :message, null: false
      t.datetime :detected_at, null: false
      t.datetime :read_at
      t.datetime :browser_notified_at

      t.timestamps
    end

    add_index :health_alerts, %i[user_id read_at]
    add_index :health_alerts, %i[glucose_reading_id alert_type], unique: true
  end
end
