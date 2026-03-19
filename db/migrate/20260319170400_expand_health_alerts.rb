class ExpandHealthAlerts < ActiveRecord::Migration[8.1]
  def change
    change_column_null :health_alerts, :glucose_reading_id, true
    add_reference :health_alerts, :medication_reminder, foreign_key: true
    add_column :health_alerts, :acknowledged_at, :datetime
    add_column :health_alerts, :resolved_at, :datetime

    add_index :health_alerts, %i[medication_reminder_id alert_type], unique: true
    add_index :health_alerts, :acknowledged_at
    add_index :health_alerts, :resolved_at
  end
end
