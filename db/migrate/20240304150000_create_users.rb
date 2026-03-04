# frozen_string_literal: true

class CreateUsers < ActiveRecord::Migration[8.1]
  def change
    create_table :users do |t|
      t.string :email, null: false, index: { unique: true }
      t.string :password_digest, null: false
      t.integer :role, default: 0, null: false
      t.text :dexcom_access_token
      t.text :dexcom_refresh_token
      t.datetime :dexcom_token_expires_at

      t.timestamps
    end
  end
end
