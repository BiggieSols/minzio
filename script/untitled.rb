PersonalityType.all.each do |p|
  title = p.title
  nickname = p.nickname.split.last
  p.large_info.gsub!("a #{nickname}", "an #{title}")
  if p.large_info.index(nickname)
    puts title
    puts nickname
    p.save
  end
  # p p.large_info.index("a #{nickname}")
end