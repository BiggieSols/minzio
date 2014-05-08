class Invitation < ActiveRecord::Base
  # attr_accessible :title, :body
  attr_accessible :from_user_id, :to_user_id, :message

  belongs_to :sending_user,   foreign_key: :from_user_id, class_name: "User"
  belongs_to :receiving_user, foreign_key: :to_user_id,   class_name: "User"
end
