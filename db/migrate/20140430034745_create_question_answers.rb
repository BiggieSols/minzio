class CreateQuestionAnswers < ActiveRecord::Migration
  def change
    create_table :question_answers do |t|
      t.references :question
      t.references :answer

      t.timestamps
    end
    add_index :question_answers, :question_id
    add_index :question_answers, :answer_id
  end
end
