class TipVote < ActiveRecord::Base
  belongs_to :tip
  belongs_to :user
  attr_accessible :vote_value
end
