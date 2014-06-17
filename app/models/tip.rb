class Tip < ActiveRecord::Base
  attr_accessible :author_user_id, :custom_personality_id, :relationship_type, :text
end
