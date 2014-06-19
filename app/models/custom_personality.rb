class CustomPersonality < ActiveRecord::Base
  attr_accessible :user_id

  belongs_to :user
  has_many :tips
  # has_many :as_manager_tips,    class_name: "Tip", conditions: proc { ["relationship_type = ?", "as_manager"  ] }
  # has_many :as_colleague_tips,  class_name: "Tip", conditions: proc { ["relationship_type = ?", "as_colleague"] }
  # has_many :as_employee_tips,   class_name: "Tip", conditions: proc { ["relationship_type = ?", "as_employee" ] }

  def add_defaults(personality_type)
    tips_hash                 = {}
    tips_hash[:as_manager]    = personality_type.as_manager
    tips_hash[:as_employee]   = personality_type.as_employee
    tips_hash[:as_colleague]  = personality_type.as_colleague

    # TODO: REMOVE ALL DEFAULT TIPS FROM OLD PERSONALITY TYPE WITH NO VOTES - KEEP OTHERS
    # self.remove_old_tips
    
    self.remove_old_tips if self.tips.length > 0
    tips_hash.each do |relation, tips_arr|
      tips_arr.each do |tip|
        self.tips.build(relationship_type: relation, text: tip)
      end
    end
    self.save
  end

  def remove_old_tips
    tip_ids_to_remove = self.tips.includes(:tip_votes)
                            .where(author_user_id: nil)
                            .select {|tip| tip.score == 0}
                            .map(&:id)
    Tip.destroy tip_ids_to_remove
  end
end
