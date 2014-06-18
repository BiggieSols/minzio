json.(@user, :num_sent_invitations, :id, :updated_at, :name, :description, :headline, :image_url, :large_image_url, :location, :industry, :pub_profile, :mbti_test_result, :referral_hash, :custom_personality, :personality_type, :connections)

json.custom_personality do
  # json.as_manager(@user.custom_personality.as_manager_tips)
  json.as_manager do
    json.partial!('tips/index', tips: @manager_tips)
  end

  json.as_colleague do
    json.partial!('tips/index', tips: @colleague_tips)
  end

  json.as_employee do
    json.partial!('tips/index', tips: @employee_tips)
  end
end