class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :name
      t.string :uid
      t.string :provider
      t.string :email
      t.string :description
      t.string :headling
      t.string :industry
      t.string :pub_profile

      t.timestamps
    end

    add_index :users, :uid
  end
end
