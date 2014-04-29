class QuestionAnswer < ActiveRecord::Base
  belongs_to :question
  belongs_to :answer
  # attr_accessible :title, :body
end
