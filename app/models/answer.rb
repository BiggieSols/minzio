class Answer < ActiveRecord::Base
  serialize :result_calc, JSON
  
  belongs_to :question
  attr_accessible :body, :result_calc
end
