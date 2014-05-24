class Group < ActiveRecord::Base
  attr_accessible :name, :admin_id

  has_many    :memberships, foreign_key: :group_id, class_name: "GroupMember", dependent: :destroy
  has_many    :members, through: :memberships, source: :user
  belongs_to  :admin, class_name: "User"

  has_many :invitations
end