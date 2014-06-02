class Group < ActiveRecord::Base
  attr_accessible :name, :admin_id, :referral_hash

  has_many    :memberships, foreign_key: :group_id, class_name: "GroupMember", dependent: :destroy
  has_many    :members, through: :memberships, source: :user
  belongs_to  :admin, class_name: "User"

  has_many :invitations

  before_validation :set_refferal_hash, on: :create

  def set_referral_hash
    self.referral_hash = SecureRandom.urlsafe_base64(8);
  end

end