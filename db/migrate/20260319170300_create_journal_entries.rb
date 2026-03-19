class CreateJournalEntries < ActiveRecord::Migration[8.1]
  def change
    create_table :journal_entries do |t|
      t.references :user, null: false, foreign_key: true
      t.datetime :recorded_at, null: false
      t.text :symptoms
      t.integer :activity_minutes
      t.string :mood, null: false, default: "neutral"
      t.text :notes

      t.timestamps
    end

    add_index :journal_entries, :recorded_at
  end
end
