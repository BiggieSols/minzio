json.(@quiz, :title, :description)
json.questions do
  json.array!(@quiz.questions.shuffle) do |question|
    json.(question, :body, :id)
    json.answers do
      json.array!(question.answers.shuffle) do |answer|
        json.(answer, :body, :id)
      end
    end
  end
end