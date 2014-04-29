class CreateUserTests < ActiveRecord::Migration
  def change
    create_table :user_tests do |t|
      t.references :user
      t.references :test
      t.boolean :started
      t.boolean :finished

      t.timestamps
    end
    add_index :user_tests, :user_id
    add_index :user_tests, :test_id
  end
end
