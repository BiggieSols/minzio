module TipsHelper
  def valid_tip_modify_request?(tip)
    [tip.author_user_id, tip.custom_personality.user_id].include? current_user.id
  end

  def valid_tip_create_request?(tip)
    current_user.valid_connection_ids.include?(tip.custom_personality.user_id)
  end
end
