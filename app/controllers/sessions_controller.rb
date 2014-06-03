class SessionsController < ApplicationController
  skip_before_filter :require_login, only: [:create_from_linkedin, :new, :create]
  
  def create_from_linkedin
    auth_hash = request.env['omniauth.auth']
    log_in! User.from_omniauth(auth_hash)

    check_referral_codes
    if current_user.personality_type_id
      current_user.delay.build_shadow_accounts
      # remove this later
      redirect_to "/#/groups"
    else
      # # puts "referring user is #{session[:referring_user].name}"
      redirect_to "/#/how"
    end
  end

  def new
    @user = User.new
  end
  
  def create
    @user = User.find_by_credentials(params[:user])
    # render json: @user

    if @user
      log_in! @user
      render json: @user
      # redirect_to "/#/feed"
    else
      flash[:errors] = ["invalid username or password"]
      @user = User.new(params[:user])
      # this part below is only for rails, can remove w/ backbone
      # @user = User.new(params[:user])
      render :new
    end
  end

  def destroy
    log_out!
    # puts "\n"*5
    # puts "logging out"
    # puts "\n"*5
    redirect_to root_url
  end
end
