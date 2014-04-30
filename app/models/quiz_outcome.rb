class TestOutcome < ActiveRecord::Base
  belongs_to :test
  belongs_to :outcome
  # attr_accessible :title, :body
end
