# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2024_03_04_170000) do
  create_table "dexcom_sync_logs", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "last_sync_at", null: false
    t.integer "records_imported", default: 0
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["user_id"], name: "index_dexcom_sync_logs_on_user_id"
  end

  create_table "glucose_readings", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "recorded_at", null: false
    t.string "source", default: "manual", null: false
    t.string "trend"
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.decimal "value", precision: 5, scale: 2, null: false
    t.index ["user_id", "recorded_at"], name: "index_glucose_readings_on_user_id_and_recorded_at"
    t.index ["user_id"], name: "index_glucose_readings_on_user_id"
  end

  create_table "manual_entries", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "entry_type", null: false
    t.text "notes"
    t.datetime "recorded_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.decimal "value", precision: 8, scale: 2
    t.index ["user_id", "recorded_at"], name: "index_manual_entries_on_user_id_and_recorded_at"
    t.index ["user_id"], name: "index_manual_entries_on_user_id"
  end

  create_table "meals", force: :cascade do |t|
    t.decimal "bolus", precision: 5, scale: 2
    t.decimal "carbs", precision: 6, scale: 2
    t.datetime "created_at", null: false
    t.decimal "glucose", precision: 5, scale: 2
    t.string "meal_type"
    t.text "notes"
    t.datetime "recorded_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["user_id", "recorded_at"], name: "index_meals_on_user_id_and_recorded_at"
    t.index ["user_id"], name: "index_meals_on_user_id"
  end

  create_table "targets", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.decimal "max_glucose", precision: 5, scale: 2, default: "180.0"
    t.decimal "min_glucose", precision: 5, scale: 2, default: "70.0"
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["user_id"], name: "index_targets_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "dexcom_access_token"
    t.text "dexcom_refresh_token"
    t.datetime "dexcom_token_expires_at"
    t.string "email", null: false
    t.string "password_digest", null: false
    t.integer "role", default: 0, null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "dexcom_sync_logs", "users"
  add_foreign_key "glucose_readings", "users"
  add_foreign_key "manual_entries", "users"
  add_foreign_key "meals", "users"
  add_foreign_key "targets", "users"
end
