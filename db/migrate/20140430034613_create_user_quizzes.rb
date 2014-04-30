class CreateUserQuizzes < ActiveRecord::Migration
  def change
    create_table :user_quizzes do |t|
      t.references :user
      t.references :quiz
      t.boolean :started
      t.boolean :completed

      t.timestamps
    end
    add_index :user_quizzes, :user_id
    add_index :user_quizzes, :quiz_id
  end
end
