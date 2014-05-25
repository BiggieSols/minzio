class AddMessageSentToInvitations < ActiveRecord::Migration
  def change
    add_column :invitations, :message_sent, :boolean, default: false

    add_index :invitations, :message_sent
  end
end
