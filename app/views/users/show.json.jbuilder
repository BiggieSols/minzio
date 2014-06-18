json.(@user, :num_sent_invitations, :id, :updated_at, :name, :description, :headline, :image_url, :large_image_url, :location, :industry, :pub_profile, :mbti_test_result, :referral_hash, :custom_personality, :personality_type, :connections)

json.custom_personality do
  # json.as_manager(@user.custom_personality.as_manager_tips)
  json.as_manager do
    json.array!(@manager_tips) do |tip|
      json.(tip, :id, :relationship_type, :text, :score)
      json.curr_user_vote(tip.vote_from_user(current_user.id))
    end
  end

  json.as_colleague do
    json.array!(@colleague_tips) do |tip|
      json.(tip, :id, :relationship_type, :text, :score)
      json.curr_user_vote(tip.vote_from_user(current_user.id))
    end
  end

  json.as_employee do
    json.array!(@employee_tips) do |tip|
      json.(tip, :id, :relationship_type, :text, :score)
      json.curr_user_vote(tip.vote_from_user(current_user.id))
    end
  end

  # json.partial!('users/user_lite', user: @user)
end