class CreateTestQuestions < ActiveRecord::Migration
  def change
    create_table :test_questions do |t|
      t.references :test
      t.references :question

      t.timestamps
    end
    add_index :test_questions, :test_id
    add_index :test_questions, :question_id
  end
end
