json.(@quiz, :title, :description)
json.questions do
  json.array!(@quiz.questions) do |question|
    json.(question, :body, :id)
    json.answers do
      json.array!(question.answers) do |answer|
        json.(answer, :body, :id)
      end
    end
  end
end