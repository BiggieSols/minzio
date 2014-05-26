class AddSubjectToInvitations < ActiveRecord::Migration
  def change
    add_column :invitations, :subject, :string
  end
end
