class AddPersonalityTypeIdToUsers < ActiveRecord::Migration
  def change
    add_column :users, :personality_type_id, :integer

    add_index :users, :personality_type_id
  end
end
