class AddReferralHashToUsers < ActiveRecord::Migration
  def change
    add_column :users, :referral_hash, :string
    add_index :users, :referral_hash
  end
end
