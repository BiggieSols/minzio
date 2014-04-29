class CreateOutcomes < ActiveRecord::Migration
  def change
    create_table :outcomes do |t|
      t.string :title_string
      t.text :details

      t.timestamps
    end
  end
end
