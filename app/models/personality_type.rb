class PersonalityType < ActiveRecord::Base
  serialize :as_colleague, JSON
  serialize :as_manager, JSON
  serialize :as_employee, JSON
  attr_accessible :small_info, :large_info, :as_colleague, :as_manager, :as_employee, :title, :nickname
end