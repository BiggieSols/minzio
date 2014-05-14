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
    puts current_user
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
end
