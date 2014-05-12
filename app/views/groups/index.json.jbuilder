json.array!(@groups) do |group|
  json.partial!('groups/show', group: group)
end