module TipVotesHelper
  def valid_create_request?(tip_vote)
    profile_user_id = tip_vote.tip.custom_personality.user_id
    current_user.valid_connection_ids.include? profile_user_id
  end

  def valid_destroy_request?(tip_vote)
    tip_vote.user_id == current_user.id
  end

end
