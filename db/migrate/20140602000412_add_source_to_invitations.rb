class AddSourceToInvitations < ActiveRecord::Migration
  def change
    add_column :invitations, :source, :string
  end
end
