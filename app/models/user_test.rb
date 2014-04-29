class UserTest < ActiveRecord::Base
  belongs_to :user
  belongs_to :test
  attr_accessible :finished, :started
end
