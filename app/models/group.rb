class Group < ActiveRecord::Base
  attr_accessible :name, :admin_id

  has_many :memberships, foreign_key: :group_id, class_name: "GroupMember"
  has_many :members, through: :memberships, source: :user
end