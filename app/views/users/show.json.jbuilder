
# json.(@user, :id, :updated_at, :name, :description, :headline, :image_url, :large_image_url, :location, :industry, :pub_profile, :mbti_test_result, :personality_type, :referral_hash, :custom_personality, :num_sent_invitations, :connections)
json.partial!('users/user_other', user: @user)
json.(@user, :referral_hash, :num_sent_invitations)#, :connections)