class AddAdminIdToGroups < ActiveRecord::Migration
  def change
    add_column :groups, :admin_id, :integer
    add_index :groups, :admin_id
  end
end
