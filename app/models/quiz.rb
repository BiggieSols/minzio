class Quiz < ActiveRecord::Base
  attr_accessible :description, :title

  has_many :questions
end
