class AddUserToGlucoseReadings < ActiveRecord::Migration[8.1]
  class MigrationUser < ApplicationRecord
    self.table_name = "users"
  end

  class MigrationGlucoseReading < ApplicationRecord
    self.table_name = "glucose_readings"
  end

  def up
    add_reference :glucose_readings, :user, foreign_key: true

    demo_user = MigrationUser.find_or_create_by!(email: "demo@diabetcare.local") do |user|
      user.name = "Demo Patient"
      user.password_digest = BCrypt::Password.create("password123")
    end

    MigrationGlucoseReading.where(user_id: nil).update_all(user_id: demo_user.id)

    change_column_null :glucose_readings, :user_id, false
  end

  def down
    remove_reference :glucose_readings, :user, foreign_key: true
    MigrationUser.where(email: "demo@diabetcare.local").delete_all
  end
end
