class UsersController < ApplicationController
  skip_before_filter :require_login, only: [:show, :new, :create]

  # remove this in production
  def index
    render json: {}
  end

  def show
    if !current_user
      render json: {}
    else
      params[:id] = current_user.id if params[:id] == "current"
      params[:id] = 1 if params[:id] == "dummy"
      if(params[:id] == "current")
        @user = User.includes(:personality_type, :groups => [:members]).find(current_user.id)
        render 'show.json.jbuilder'
      elsif current_user.valid_connection_ids.include?(params[:id].to_i)
        @user = User.includes(:personality_type).find(params[:id])
        # at some point only pull down a limited set of results
        render 'show.json.jbuilder'
      else
        render json: {}
      end
    end
  end

  def new
    @user = User.new
  end

  def edit
    @user = User.find(params[:id])
  end

  def create
    @user = User.new(params[:user])
    if @user.save
      log_in! @user
      render json: @user
    else
      flash[:errors] = @user.errors.full_messages
      @user = User.new(params[:user])
      render :new
    end
  end

  def update
    if params[:build_shadow] && params[:async]
      puts "\n\n\n\nbuilding shadow accts async\n\n\n\n"
      current_user.delay.build_shadow_accounts
      @user = current_user
      render 'show.json.jbuilder'
    elsif params[:build_shadow]
      puts "\n\n\n\nbuilding shadow accts synchronously\n\n\n\n"
      current_user.build_shadow_accounts
      @user = current_user
      render 'show.json.jbuilder'
    else
      @user = User.find(params[:id])
      if @user.update_attributes(params[:user])
        # log_in! @user
        render json: @user
      else
        flash[:errors] = @user.errors.full_messages
        @user = User.new(params[:user])
        render :new
      end
    end
  end

  def destroy
    @user = User.find(params[:id])
    @user.destroy
    render json: @user
  end
end
