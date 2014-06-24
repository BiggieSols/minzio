class Tip < ActiveRecord::Base
  default_scope where(:hidden => false)
  
  attr_accessible :author_user_id, :custom_personality_id, :relationship_type, :text, :anonymous

  belongs_to :custom_personality
  belongs_to :author, foreign_key: :author_user_id, class_name: "User"

  has_many :tip_votes, dependent: :destroy

  def score
    
    self.tip_votes.map(&:vote_value).reduce(:+) || 0
  end

  def vote_from_user(user_id)
    # return nil
    # vote = self.tip_votes.find_by_user_id(user_id)
    vote = self.tip_votes.select {|tip_vote| tip_vote.user_id == user_id}.first
    # puts "\ngot here\n"
    vote.vote_value if vote
  end

  def anonymized_author_id
    return nil if self.anonymous
    author_user_id
  end

  def anonymized_author_name
    return nil if self.anonymous
    User.find(self.anonymized_author_id).name
  end
end