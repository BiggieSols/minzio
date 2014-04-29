class TestQuestion < ActiveRecord::Base
  belongs_to :test
  belongs_to :question
  # attr_accessible :title, :body
end
