class Test < ActiveRecord::Base
  attr_accessible :description, :title

  has_many :test_questions
  has_many :questions, through: :test_questions, source: :question
end
