class CustomPersonality < ActiveRecord::Base
  attr_accessible :user_id
  
  belongs_to :user
  has_many :tips
  # has_many :as_manager_tips, conditions: proc {["to_user_id = ?", User.current_user.id] }
  # has_many :as_colleague_tips
  # has_many :as_employee_tips

  # attr_accessible :title, :body
end
