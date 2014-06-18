class TipVote < ActiveRecord::Base
  belongs_to :tip
  belongs_to :user
  attr_accessible :user_id, :tip_id, :vote_value
end