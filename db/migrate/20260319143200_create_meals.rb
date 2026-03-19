class CreateMeals < ActiveRecord::Migration[8.1]
  def change
    create_table :meals do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.integer :carbs, null: false
      t.datetime :eaten_at, null: false
      t.text :notes

      t.timestamps
    end

    add_index :meals, :eaten_at
  end
end
