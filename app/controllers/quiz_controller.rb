class QuizController < ApplicationController
  def show
    # quiz = Quiz.find(params[:id])
    @quiz = Quiz.find(params[:id], include: [:questions => :answers])
    # render json: quiz
    render 'show.json.jbuilder'
  end
end
