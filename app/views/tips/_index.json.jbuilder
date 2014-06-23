json.array!(tips) do |tip|
  json.partial!('tips/show', tip: tip)
end
