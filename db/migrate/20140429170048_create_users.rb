class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :name
      t.string :uid
      t.string :provider
      t.string :email
      t.text   :description
      t.string :headline
      t.string :image_url
      t.string :location
      t.string :industry
      t.string :pub_profile
      t.string :access_token
      t.string :access_token_secret
      t.string :session_token
      t.string :password_digest
      t.timestamps
    end

    add_index :users, :uid
  end
end


