class AddJobTitleAndCompanyToUsers < ActiveRecord::Migration
  def change
    add_column :users, :job_title_id, :integer
    add_column :users, :company_id, :integer

    add_index :users, :job_title_id
    add_index :users, :company_id
  end
end
