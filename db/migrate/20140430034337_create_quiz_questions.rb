class CreateQuizQuestions < ActiveRecord::Migration
  def change
    create_table :quiz_questions do |t|
      t.references :quiz
      t.references :question

      t.timestamps
    end
    add_index :quiz_questions, :quiz_id
    add_index :quiz_questions, :question_id
  end
end
