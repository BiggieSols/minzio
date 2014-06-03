class StaticPagesController < ApplicationController
  skip_before_filter :require_login
  
  def empty
    render :status => 500
  end

  def landing
    user_referral_code  = params[:u] #u = User Referral ID
    group_referral_code = params[:g] #g = Group Referral ID

    session[:referring_user_id] = User.find_by_referral_hash(user_referral_code).id     if user_referral_code
    session[:referred_group_id] = Group.find_by_referral_hash(group_referral_code).id   if group_referral_code
    check_referral_codes
  end
end
