json.(group, :id, :name, :updated_at, :referral_hash, :admin_id)
json.members do
  json.array!(group.members) do |member|
    # json.name("sol");
    json.partial!('users/user_lite', user: member)
  end
end