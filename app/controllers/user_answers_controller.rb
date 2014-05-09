class UserAnswersController < ApplicationController
  def index
    answers = UserAnswer.where(user_id: current_user.id)
    answer = {user_answer: answers}
    render json: answers
  end

  # note this is for bulk creation to minimize calls to the server
  def create
    ActiveRecord::Base.transaction do
      UserAnswer.where(user_id: current_user.id).destroy_all

      params.each do |pair|
        if pair.last.class == ActiveSupport::HashWithIndifferentAccess
          user_answer = pair.last
          if user_answer[:id]
            # NOTE: CAUSES N+1 QUERY. FIX THIS WHEN WRITING AN UPDATE FUNCTION
            UserAnswer.find(user_answer[:id])
                      .update_attributes(answer_id: user_answer["answer_id"])
          elsif user_answer[:answer_id]
            UserAnswer.create(
              answer_id: user_answer["answer_id"], 
              user_id: current_user.id
            )
          end
        end
      end
    end
    
    current_user.set_personality_type
    render json: params
  end
end
