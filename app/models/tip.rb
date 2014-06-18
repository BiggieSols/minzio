class Tip < ActiveRecord::Base
  attr_accessible :author_user_id, :custom_personality_id, :relationship_type, :text

  belongs_to :custom_personality
  belongs_to :author, foreign_key: :author_user_id, class_name: "User"
  has_many :tip_votes
end
