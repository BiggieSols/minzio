manager_tips   = user.custom_personality.tips.select { |tip| tip.relationship_type == "as_manager"   }
colleague_tips = user.custom_personality.tips.select { |tip| tip.relationship_type == "as_colleague" }
employee_tips  = user.custom_personality.tips.select { |tip| tip.relationship_type == "as_employee"  }

json.(user, :id, :updated_at, :name, :description, :headline, :image_url, :large_image_url, :location, :industry, :pub_profile, :mbti_test_result, :personality_type_id, :personality_type, :valid_connection_ids, :groups)

json.custom_personality do
  # json.as_manager(@user.custom_personality.as_manager_tips)
  json.as_manager do
    json.partial!('tips/index', tips: manager_tips)
  end

  json.as_colleague do
    json.partial!('tips/index', tips: colleague_tips)
  end

  json.as_employee do
    json.partial!('tips/index', tips: employee_tips)
  end

  json.id(user.custom_personality.id)
end