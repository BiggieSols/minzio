class QuizQuestion < ActiveRecord::Base
  belongs_to :quiz
  belongs_to :question
  # attr_accessible :title, :body
end
