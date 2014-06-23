class AddHiddenToTips < ActiveRecord::Migration
  def change
    add_column :tips, :hidden, :boolean, default: false
    add_index :tips, :hidden
  end
end
