class CreateTestOutcomes < ActiveRecord::Migration
  def change
    create_table :test_outcomes do |t|
      t.references :test
      t.references :outcome

      t.timestamps
    end
    add_index :test_outcomes, :test_id
    add_index :test_outcomes, :outcome_id
  end
end
