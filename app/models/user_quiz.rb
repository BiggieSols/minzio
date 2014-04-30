class UserQuiz < ActiveRecord::Base
  belongs_to :user
  belongs_to :quiz
  attr_accessible :completed, :started
end
