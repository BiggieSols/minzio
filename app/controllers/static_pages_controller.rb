class StaticPagesController < ApplicationController
  skip_before_filter :require_login
  
  def empty
    render :status => 500
  end

  def landing
    user_referral_code  = params[:u] #u = User Referral ID
    group_referral_code = params[:g] #g = Group Referral ID
  end
end
