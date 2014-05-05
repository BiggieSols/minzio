class Question < ActiveRecord::Base
  belongs_to :quiz
  has_many :answers
  attr_accessible :body
end
