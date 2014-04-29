class UsersController < ApplicationController
  def index
  end

  def show
    @user = User.find(params[:id])
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

  def destroy
    @user = User.find(params[:id])
    @user.destroy
    render json: @user
  end
end
