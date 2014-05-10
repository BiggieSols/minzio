class SessionsController < ApplicationController
  def create_from_linkedin
    auth_hash = request.env['omniauth.auth']
    log_in! User.from_omniauth(auth_hash)
    # render json: auth_hash
    redirect_to "/#/users/#{current_user.id}"
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
    #   @user = User.new(params[:user])
      render :new
    end
  end

  def destroy
    log_out!
    redirect_to new_session_path
  end

end
