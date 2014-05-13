class AddConnectionsToUsers < ActiveRecord::Migration
  def change
    add_column :users, :connections, :text
  end
end
