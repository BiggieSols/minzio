class UserAnswer < ActiveRecord::Base
  belongs_to :user
  belongs_to :answer
  
  attr_accessible :user_id, :answer_id
end
