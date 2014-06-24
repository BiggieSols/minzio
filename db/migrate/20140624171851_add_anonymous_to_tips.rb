class AddAnonymousToTips < ActiveRecord::Migration
  def change
    add_column :tips, :anonymous, :boolean, default: true

    add_index :tips, :anonymous
  end
end
