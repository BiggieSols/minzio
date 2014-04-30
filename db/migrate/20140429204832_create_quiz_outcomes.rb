class CreateQuizOutcomes < ActiveRecord::Migration
  def change
    create_table :quiz_outcomes do |t|
      t.references :quiz
      t.references :outcome

      t.timestamps
    end
    add_index :quiz_outcomes, :quiz_id
    add_index :quiz_outcomes, :outcome_id
  end
end
