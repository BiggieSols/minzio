json.(group, :id, :name)
json.members do
  json.array!(group.members) do |member|
    json.partial!('users/user_lite', user: member)
  end
end