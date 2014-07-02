class StaticPagesController < ApplicationController
  skip_before_filter :require_login
  
  def empty
    render :status => 500
  end

  def landing
    session[:referring_user_id] = nil
    session[:referred_group_id] = nil

    puts "\n"*20
    puts params
    puts "\n"*20

    user_referral_code  = params[:u] #u = User Referral ID
    group_referral_code = params[:g] #g = Group Referral ID

    begin
      session[:referring_user_id] = User.find_by_referral_hash(user_referral_code).id     if user_referral_code
      session[:referred_group_id] = Group.find_by_referral_hash(group_referral_code).id   if group_referral_code
    rescue
    end

    # puts "\n"*10
    # puts "referring user id is #{session[:referring_user_id].inspect}"
    # puts "referred group id is #{session[:referred_group_id].inspect}"
    # puts "\n"*10
    check_referral_codes

    if !current_user 
      # redirect_to '/home'
      render 'landing'
    elsif current_user.personality_type_id
      # redirect_to "/#/groups"
      render 'groups'#, anchor: "groups"
      # render 'landing'
    elsif !current_user.personality_type_id
      # redirect_to "/#/how"
      # render 'how'
      redirect_to '/how'
      # render 'landing'
    end
    # render 'landing'
  end

  def contact
  end

  def home
    render 'landing'
  end

  def how
    # render 'landing'
  end

  def privacy
  end

  def terms
  end
end
