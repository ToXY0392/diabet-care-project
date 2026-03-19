class CreateDexcomConnections < ActiveRecord::Migration[8.1]
  def change
    create_table :dexcom_connections do |t|
      t.references :user, null: false, foreign_key: true, index: { unique: true }
      t.text :access_token, null: false
      t.text :refresh_token, null: false
      t.datetime :expires_at, null: false
      t.datetime :last_synced_at
      t.string :external_user_id
      t.string :environment, null: false, default: "sandbox"
      t.datetime :revoked_at

      t.timestamps
    end

    add_index :dexcom_connections, :external_user_id
  end
end
