class AddNicknameToPersonalityType < ActiveRecord::Migration
  def change
    add_column :personality_types, :nickname, :string
  end
end
