class Question < ActiveRecord::Base
  belongs_to :quiz
  attr_accessible :body
end
