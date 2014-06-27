class TipVotesController < ApplicationController
  def create
    puts "\n"*5
    puts params
    puts "\n"*5
    tip_vote = TipVote.where(
                             tip_id: params["tip_id"], 
                             user_id: current_user.id
                            ).first_or_initialize
    tip_vote.update_attributes(vote_value: params[:vote_value]) if valid_create_request?(tip_vote)
    # tip_vote.save
    render json: tip_vote
  end

  def destroy
    puts "\n"*5
    puts params
    puts "\n"*5

    tip_vote = TipVote.find_by_user_id_and_tip_id(current_user.id, params[:tip_id])
    tip_vote.destroy if valid_destroy_request?(tip_vote)
    render json: tip_vote
  end

  private

  def valid_create_request?(tip_vote)
    profile_user_id = tip_vote.tip.custom_personality.user_id
    current_user.valid_connection_ids.include? profile_user_id
  end

  def valid_destroy_request?(tip_vote)
    tip_vote.user_id == current_user.id
  end
end
