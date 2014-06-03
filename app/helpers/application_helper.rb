module ApplicationHelper
  def log_in!(user)
    user.reset_session_token!
    @current_user = user;
    session[:session_token] = user.session_token
  end

  def current_user
    return nil if !session[:session_token]
    # @current_user ||= User.includes(:groups => [:members]).find_by_session_token(session[:session_token])
    @current_user ||= User.includes(:groups).find_by_session_token(session[:session_token])
  end

  def current_user=(user)
    @current_user = user
  end

  def log_out!
    # puts current_user
    current_user.reset_session_token!
    session[:session_token] = nil
    @current_user = nil
  end

  def logged_in?
    !!current_user
  end

  def require_login
    redirect_to empty_url unless logged_in?
  end

  def check_referral_codes
    user_id  = session[:referring_user_id]
    group_id = session[:referred_group_id]

    #must be logged in have valid session tokens
    return if !current_user || !user_id 

    #can't refer yourself
    return if current_user.id == user_id 

    invite = Invitation.where(
                                from_user_id: user_id, 
                                group_id:     group_id,
                                to_user_id:   current_user.id
                              ).first

    # if the user already has completed the profile...
    # if current_user.personality_type_id
    if !invite
      Invitation.create(
                        from_user_id: user_id, 
                        group_id:     group_id,
                        to_user_id:   current_user.id,
                        message:      "referral_link", 
                        subject:      "referral_link",
                        source:       "referral_link"      
                       )

      # if the user is not currently in the group (it's possible another user already invited current_user to the group)
      if !current_user.group_ids.include? group_id
        GroupMember.create(user_id: current_user.id, group_id: group_id)
      end
    end
    session[:referring_user_id] = nil
    session[:referred_group_id] = nil
  end
  # handle_asyncronously :check_referral_codes
end
