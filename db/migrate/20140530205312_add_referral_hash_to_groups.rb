class AddReferralHashToGroups < ActiveRecord::Migration
  def change
    add_column :groups, :referral_hash, :string
    add_index :groups, :referral_hash
  end
end