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

ActiveRecord::Schema[8.1].define(version: 2026_03_19_180300) do
  create_table "clinical_notes", force: :cascade do |t|
    t.text "body", null: false
    t.string "category", default: "follow_up", null: false
    t.integer "clinician_id", null: false
    t.datetime "created_at", null: false
    t.integer "patient_id", null: false
    t.boolean "pinned", default: false, null: false
    t.datetime "recorded_at", null: false
    t.string "title", default: "Note clinique", null: false
    t.datetime "updated_at", null: false
    t.index ["clinician_id", "patient_id", "recorded_at"], name: "index_clinical_notes_on_clinician_patient_recorded_at"
    t.index ["clinician_id"], name: "index_clinical_notes_on_clinician_id"
    t.index ["patient_id"], name: "index_clinical_notes_on_patient_id"
  end

  create_table "clinician_appointments", force: :cascade do |t|
    t.string "appointment_type", null: false
    t.integer "clinician_id", null: false
    t.datetime "created_at", null: false
    t.datetime "ends_at"
    t.integer "patient_id", null: false
    t.text "preparation_notes"
    t.text "reason", null: false
    t.datetime "starts_at", null: false
    t.string "status", default: "scheduled", null: false
    t.datetime "updated_at", null: false
    t.index ["clinician_id", "starts_at"], name: "index_clinician_appointments_on_clinician_and_starts_at"
    t.index ["clinician_id"], name: "index_clinician_appointments_on_clinician_id"
    t.index ["patient_id", "starts_at"], name: "index_clinician_appointments_on_patient_and_starts_at"
    t.index ["patient_id"], name: "index_clinician_appointments_on_patient_id"
  end

  create_table "clinician_conversation_participants", force: :cascade do |t|
    t.integer "clinician_conversation_id", null: false
    t.datetime "created_at", null: false
    t.datetime "last_read_at"
    t.string "role", null: false
    t.integer "unread_count", default: 0, null: false
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["clinician_conversation_id", "role"], name: "index_conversation_participants_on_conversation_and_role", unique: true
    t.index ["clinician_conversation_id", "user_id"], name: "index_conversation_participants_on_conversation_and_user", unique: true
    t.index ["clinician_conversation_id"], name: "idx_on_clinician_conversation_id_612ab03047"
    t.index ["user_id"], name: "index_clinician_conversation_participants_on_user_id"
  end

  create_table "clinician_conversations", force: :cascade do |t|
    t.integer "clinician_id", null: false
    t.datetime "created_at", null: false
    t.datetime "last_message_at"
    t.text "last_message_preview"
    t.integer "patient_id", null: false
    t.string "status", default: "active", null: false
    t.string "subject"
    t.datetime "updated_at", null: false
    t.index ["clinician_id", "patient_id"], name: "index_clinician_conversations_on_pair", unique: true
    t.index ["clinician_id"], name: "index_clinician_conversations_on_clinician_id"
    t.index ["patient_id"], name: "index_clinician_conversations_on_patient_id"
  end

  create_table "clinician_messages", force: :cascade do |t|
    t.integer "author_id", null: false
    t.text "body", null: false
    t.integer "clinician_conversation_id", null: false
    t.datetime "created_at", null: false
    t.datetime "sent_at", null: false
    t.datetime "updated_at", null: false
    t.index ["author_id"], name: "index_clinician_messages_on_author_id"
    t.index ["clinician_conversation_id", "sent_at"], name: "index_clinician_messages_on_conversation_and_sent_at"
    t.index ["clinician_conversation_id"], name: "index_clinician_messages_on_clinician_conversation_id"
  end

  create_table "clinician_patient_profiles", force: :cascade do |t|
    t.integer "age"
    t.string "contact"
    t.datetime "created_at", null: false
    t.string "diagnosis"
    t.string "height"
    t.string "ordonnance"
    t.integer "patient_id", null: false
    t.string "phone"
    t.string "sex"
    t.string "treatment"
    t.datetime "updated_at", null: false
    t.string "weight"
    t.index ["patient_id"], name: "index_clinician_patient_profiles_on_patient_id", unique: true
  end

  create_table "coordination_notes", force: :cascade do |t|
    t.boolean "active", default: true, null: false
    t.text "body", null: false
    t.integer "clinician_id", null: false
    t.datetime "created_at", null: false
    t.string "title", default: "Note de coordination", null: false
    t.datetime "updated_at", null: false
    t.index ["clinician_id", "active", "updated_at"], name: "index_coordination_notes_on_clinician_active_updated_at"
    t.index ["clinician_id"], name: "index_coordination_notes_on_clinician_id"
  end

  create_table "dexcom_connections", force: :cascade do |t|
    t.text "access_token", null: false
    t.datetime "created_at", null: false
    t.string "environment", default: "sandbox", null: false
    t.datetime "expires_at", null: false
    t.string "external_user_id"
    t.datetime "last_synced_at"
    t.text "refresh_token", null: false
    t.datetime "revoked_at"
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["external_user_id"], name: "index_dexcom_connections_on_external_user_id"
    t.index ["user_id"], name: "index_dexcom_connections_on_user_id", unique: true
  end

  create_table "glucose_readings", force: :cascade do |t|
    t.string "context", null: false
    t.datetime "created_at", null: false
    t.string "external_id"
    t.datetime "measured_at", null: false
    t.text "notes"
    t.string "source", default: "manual", null: false
    t.string "trend"
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.integer "value", null: false
    t.index ["context"], name: "index_glucose_readings_on_context"
    t.index ["measured_at"], name: "index_glucose_readings_on_measured_at"
    t.index ["source"], name: "index_glucose_readings_on_source"
    t.index ["user_id", "source", "external_id"], name: "index_glucose_readings_on_user_id_and_source_and_external_id", unique: true
    t.index ["user_id"], name: "index_glucose_readings_on_user_id"
  end

  create_table "health_alerts", force: :cascade do |t|
    t.datetime "acknowledged_at"
    t.string "alert_type", null: false
    t.datetime "browser_notified_at"
    t.datetime "created_at", null: false
    t.datetime "detected_at", null: false
    t.integer "glucose_reading_id"
    t.integer "medication_reminder_id"
    t.string "message", null: false
    t.datetime "read_at"
    t.datetime "resolved_at"
    t.string "severity", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["acknowledged_at"], name: "index_health_alerts_on_acknowledged_at"
    t.index ["glucose_reading_id", "alert_type"], name: "index_health_alerts_on_glucose_reading_id_and_alert_type", unique: true
    t.index ["glucose_reading_id"], name: "index_health_alerts_on_glucose_reading_id"
    t.index ["medication_reminder_id", "alert_type"], name: "index_health_alerts_on_medication_reminder_id_and_alert_type", unique: true
    t.index ["medication_reminder_id"], name: "index_health_alerts_on_medication_reminder_id"
    t.index ["resolved_at"], name: "index_health_alerts_on_resolved_at"
    t.index ["user_id", "read_at"], name: "index_health_alerts_on_user_id_and_read_at"
    t.index ["user_id"], name: "index_health_alerts_on_user_id"
  end

  create_table "journal_entries", force: :cascade do |t|
    t.integer "activity_minutes"
    t.datetime "created_at", null: false
    t.string "mood", default: "neutral", null: false
    t.text "notes"
    t.datetime "recorded_at", null: false
    t.text "symptoms"
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["recorded_at"], name: "index_journal_entries_on_recorded_at"
    t.index ["user_id"], name: "index_journal_entries_on_user_id"
  end

  create_table "meals", force: :cascade do |t|
    t.integer "carbs", null: false
    t.datetime "created_at", null: false
    t.datetime "eaten_at", null: false
    t.string "name", null: false
    t.text "notes"
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["eaten_at"], name: "index_meals_on_eaten_at"
    t.index ["user_id"], name: "index_meals_on_user_id"
  end

  create_table "medication_reminders", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "dosage", null: false
    t.text "instructions"
    t.string "medication_name", null: false
    t.integer "medication_schedule_id"
    t.datetime "scheduled_at", null: false
    t.datetime "taken_at"
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["medication_schedule_id", "scheduled_at"], name: "idx_on_medication_schedule_id_scheduled_at_b1188ccd5d", unique: true
    t.index ["medication_schedule_id"], name: "index_medication_reminders_on_medication_schedule_id"
    t.index ["scheduled_at"], name: "index_medication_reminders_on_scheduled_at"
    t.index ["user_id"], name: "index_medication_reminders_on_user_id"
  end

  create_table "medication_schedules", force: :cascade do |t|
    t.boolean "active", default: true, null: false
    t.datetime "created_at", null: false
    t.string "dosage", null: false
    t.date "ends_on"
    t.text "instructions"
    t.string "medication_name", null: false
    t.text "reminder_times", null: false
    t.date "starts_on", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.integer "weekdays_mask", default: 127, null: false
    t.index ["active"], name: "index_medication_schedules_on_active"
    t.index ["user_id"], name: "index_medication_schedules_on_user_id"
  end

  create_table "patient_profiles", force: :cascade do |t|
    t.boolean "browser_notifications_enabled", default: true, null: false
    t.datetime "created_at", null: false
    t.integer "glucose_target_high", default: 180, null: false
    t.integer "glucose_target_low", default: 70, null: false
    t.integer "hyper_critical_threshold", default: 250, null: false
    t.integer "hyper_threshold", default: 180, null: false
    t.integer "hypo_critical_threshold", default: 54, null: false
    t.integer "hypo_threshold", default: 70, null: false
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["user_id"], name: "index_patient_profiles_on_user_id", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "name", null: false
    t.string "password_digest", null: false
    t.string "role", default: "patient", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["role"], name: "index_users_on_role"
  end

  add_foreign_key "clinical_notes", "users", column: "clinician_id"
  add_foreign_key "clinical_notes", "users", column: "patient_id"
  add_foreign_key "clinician_appointments", "users", column: "clinician_id"
  add_foreign_key "clinician_appointments", "users", column: "patient_id"
  add_foreign_key "clinician_conversation_participants", "clinician_conversations"
  add_foreign_key "clinician_conversation_participants", "users"
  add_foreign_key "clinician_conversations", "users", column: "clinician_id"
  add_foreign_key "clinician_conversations", "users", column: "patient_id"
  add_foreign_key "clinician_messages", "clinician_conversations"
  add_foreign_key "clinician_messages", "users", column: "author_id"
  add_foreign_key "clinician_patient_profiles", "users", column: "patient_id"
  add_foreign_key "coordination_notes", "users", column: "clinician_id"
  add_foreign_key "dexcom_connections", "users"
  add_foreign_key "glucose_readings", "users"
  add_foreign_key "health_alerts", "glucose_readings"
  add_foreign_key "health_alerts", "medication_reminders"
  add_foreign_key "health_alerts", "users"
  add_foreign_key "journal_entries", "users"
  add_foreign_key "meals", "users"
  add_foreign_key "medication_reminders", "medication_schedules"
  add_foreign_key "medication_reminders", "users"
  add_foreign_key "medication_schedules", "users"
  add_foreign_key "patient_profiles", "users"
end
