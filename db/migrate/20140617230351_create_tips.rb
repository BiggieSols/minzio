class CreateTips < ActiveRecord::Migration
  def change
    create_table :tips do |t|
      t.integer :custom_personality_id
      t.string :relationship_type
      t.integer :author_user_id
      t.text :text

      t.timestamps
    end

    add_index :tips, :custom_personality_id
    add_index :tips, :author_user_id
    add_index :tips, :relationship_type
  end
end
