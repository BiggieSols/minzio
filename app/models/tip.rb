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

  def send_creation_notification
    self.send_email_notification(create: true)
  end

  def send_deletion_notification
    self.send_email_notification(delete: true)
  end

  def send_email_notification(params = {create: false, delete: false})
    from_user = self.author
    to_user   = self.custom_personality.user

    # Do not send notifications when a user modifies own content
    return if from_user.id == to_user.id 
    
    options   = {from_user: from_user, to_user: to_user, tip: self}

    UserMailer.delay.tip_added(options) if params[:create]
    UserMailer.delay.tip_deleted(options) if params[:delete]
  end
end

