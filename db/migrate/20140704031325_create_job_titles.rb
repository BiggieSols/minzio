class CreateJobTitles < ActiveRecord::Migration
  def change
    create_table :job_titles do |t|
      t.string :name

      t.timestamps
    end
    add_index :job_titles, :name
  end
end
