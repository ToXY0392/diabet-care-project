class CreateClinicianDomainEntities < ActiveRecord::Migration[8.1]
  def change
    create_table :clinician_appointments do |t|
      t.references :clinician, null: false, foreign_key: { to_table: :users }
      t.references :patient, null: false, foreign_key: { to_table: :users }
      t.datetime :starts_at, null: false
      t.datetime :ends_at
      t.string :appointment_type, null: false
      t.string :status, null: false, default: "scheduled"
      t.text :reason, null: false
      t.text :preparation_notes

      t.timestamps
    end

    add_index :clinician_appointments, %i[clinician_id starts_at], name: "index_clinician_appointments_on_clinician_and_starts_at"
    add_index :clinician_appointments, %i[patient_id starts_at], name: "index_clinician_appointments_on_patient_and_starts_at"

    create_table :clinician_conversations do |t|
      t.references :clinician, null: false, foreign_key: { to_table: :users }
      t.references :patient, null: false, foreign_key: { to_table: :users }
      t.string :subject
      t.string :status, null: false, default: "active"
      t.text :last_message_preview
      t.datetime :last_message_at

      t.timestamps
    end

    add_index :clinician_conversations, %i[clinician_id patient_id], unique: true, name: "index_clinician_conversations_on_pair"

    create_table :clinician_conversation_participants do |t|
      t.references :clinician_conversation, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :role, null: false
      t.integer :unread_count, null: false, default: 0
      t.datetime :last_read_at

      t.timestamps
    end

    add_index :clinician_conversation_participants, %i[clinician_conversation_id user_id], unique: true, name: "index_conversation_participants_on_conversation_and_user"
    add_index :clinician_conversation_participants, %i[clinician_conversation_id role], unique: true, name: "index_conversation_participants_on_conversation_and_role"

    create_table :clinician_messages do |t|
      t.references :clinician_conversation, null: false, foreign_key: true
      t.references :author, null: false, foreign_key: { to_table: :users }
      t.text :body, null: false
      t.datetime :sent_at, null: false

      t.timestamps
    end

    add_index :clinician_messages, %i[clinician_conversation_id sent_at], name: "index_clinician_messages_on_conversation_and_sent_at"

    create_table :clinical_notes do |t|
      t.references :clinician, null: false, foreign_key: { to_table: :users }
      t.references :patient, null: false, foreign_key: { to_table: :users }
      t.string :title, null: false, default: "Note clinique"
      t.text :body, null: false
      t.string :category, null: false, default: "follow_up"
      t.boolean :pinned, null: false, default: false
      t.datetime :recorded_at, null: false

      t.timestamps
    end

    add_index :clinical_notes, %i[clinician_id patient_id recorded_at], name: "index_clinical_notes_on_clinician_patient_recorded_at"

    create_table :coordination_notes do |t|
      t.references :clinician, null: false, foreign_key: { to_table: :users }
      t.string :title, null: false, default: "Note de coordination"
      t.text :body, null: false
      t.boolean :active, null: false, default: true

      t.timestamps
    end

    add_index :coordination_notes, %i[clinician_id active updated_at], name: "index_coordination_notes_on_clinician_active_updated_at"
  end
end
