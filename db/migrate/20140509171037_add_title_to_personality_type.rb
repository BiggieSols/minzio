class AddTitleToPersonalityType < ActiveRecord::Migration
  def change
    add_column :personality_types, :title, :string
    add_index :personality_types, :title
  end
end
