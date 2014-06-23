class CreateCustomPersonalities < ActiveRecord::Migration
  def change
    create_table :custom_personalities do |t|
      t.references :user

      t.timestamps
    end
    add_index :custom_personalities, :user_id
  end
end
