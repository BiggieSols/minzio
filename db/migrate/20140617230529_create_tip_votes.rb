class CreateTipVotes < ActiveRecord::Migration
  def change
    create_table :tip_votes do |t|
      t.references :tip
      t.references :user
      t.integer :vote_value

      t.timestamps
    end
    add_index :tip_votes, :tip_id
    add_index :tip_votes, :user_id
  end
end
