# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

q = Quiz.create(title: "MBTI", description: "myers-briggs test")

answers_pairs = [
  ["expend energy, enjoy groups", "conserve energy, enjoy one-on-one"],
  ["interpret matters literally, rely on common sense", "look for meaning and possibilities, rely on foresight"],
  ["logical, thinking, questioning", "empathetic, feeling, accommodating"],
  ["organized, orderly", "flexible, adaptable"],
  ["more outgoing, think out loud", "more reserved, think to yourself"],
  ["practical, realistic, experiential", "imaginative, innovative, theoretical"],
  ["candid, straight forward, frank", "tactful, kind, encouraging"],
  ["plan, schedule", "unplanned, spontaneous"],
  ["seek many tasks, public activities, interaction with others", "seek more private, solitary activities with quiet to concentrate"],
  ["standard, usual, conventional", "different, novel, unique"],
  ["firm, tend to criticize, hold the line", "gentle, tend to appreciate, conciliate"],
  ["regulated, structured", "easygoing, “live” and “let live”"],
  ["external, communicative, express yourself", "internal, reticent, keep to yourself"],
  ["consider immediate issues, focus on the here-and-now", "look to the future, global perspective, “big picture”"],
  ["tough-minded, just", "tender-hearted, merciful"],
  ["preparation, plan ahead", "go with the flow, adapt as you go"],
  ["active, initiate", "reflective, deliberate"],
  ["facts, things, seeing “what is”", "ideas, dreams, seeing “what could be,” philosophical"],
  ["matter of fact, issue-oriented, principled", "sensitive, people-oriented, compassionate"],
  ["control, govern", "latitude, freedom"]
]

ActiveRecord::Base.transaction do 
  answers_pairs.times do |answer_pair|
    question = q.questions.create
    question.answer.create(body: answer_pair.first)
    question.answer.create(body: answer_pair.last)
  end
end