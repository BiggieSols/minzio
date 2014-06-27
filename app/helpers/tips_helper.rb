module TipsHelper
  def valid_tip_modify_request?
    [@tip.author_user_id, @tip.custom_personality.user_id].include? current_user.id
  end
end
