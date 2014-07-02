class UsersController < ApplicationController
  skip_before_filter :require_login, only: [:show, :new, :create]

  # remove this in production
  def index
    render json: {user: current_user}
    # redirect_to empty_url(anchor: 'groups')
  end

  def show
    if !current_user
      @user = User.includes(
                      :personality_type, 
                      :sent_invitations, 
                      :groups => [:members], 
                      :custom_personality => [:tips => [:tip_votes, :author]]
                      ).find(params[:id])

      # TODO: do not repeat this.
      @manager_tips   = @user.custom_personality.tips.select { |tip| tip.relationship_type == "as_manager"   }
      @colleague_tips = @user.custom_personality.tips.select { |tip| tip.relationship_type == "as_colleague" }
      @employee_tips  = @user.custom_personality.tips.select { |tip| tip.relationship_type == "as_employee"  }
      
      render 'show_public.html.erb'
    else
      params[:id] = current_user.id if params[:id] == "dummy"
      params[:id] = current_user.id if params[:id] == "current"
      
      user_id     = params[:id].to_i
      # puts "current user id is #{current_user.id}"
      if user_id == current_user.id
        # puts "\n"*5
        # puts "fetching current user"
        # puts "\n"*5
        @user = User.includes(
                              :personality_type, 
                              :sent_invitations, 
                              :groups => [:members], 
                              :custom_personality => [:tips => [:tip_votes, :author]]
                              ).find(current_user.id)

        @manager_tips   = @user.custom_personality.tips.select { |tip| tip.relationship_type == "as_manager"   }
        @colleague_tips = @user.custom_personality.tips.select { |tip| tip.relationship_type == "as_colleague" }
        @employee_tips  = @user.custom_personality.tips.select { |tip| tip.relationship_type == "as_employee"  }

        respond_to do |format|
          format.html
          format.json { render 'show.json.jbuilder' }
        end

      # elsif current_user.valid_connection_ids.include?(user_id)
      elsif User.find(user_id)
        # puts "\n"*5
        # puts "fetching other user"
        # puts "\n"*5
        @user = User.includes(
                              :personality_type, 
                              :custom_personality => [:tips => [:tip_votes, :author]]
                              ).find(user_id)
        # at some point only pull down a limited set of results
        render 'show_other.json.jbuilder'
      else
        # puts "\n"*5
        # puts "user is not valid"
        # puts user_id
        # puts current_user.id
        # puts "\n"*5
        # render status: 500
        head :bad_request
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
    # params.delete("connections")
    # params.delete("user")
    # # puts "\n"*5
    # # puts params.keys.sort
    # # puts "\n"*5
    # # puts "build_shadow: #{params[:build_shadow]}"
    # # puts "async: #{params[:async]}"


    if params[:build_shadow] && (params[:async] == true)
      # # puts "\n"*5
      # # puts "ASYNC: building shadow accounts"
      # # puts "\n"*5

      current_user.delay.build_shadow_accounts
      @user = current_user
      render 'show.json.jbuilder'
    elsif params[:build_shadow] && (params[:async] == false)
      # # puts "\n"*5
      # # puts "SYNCHRONOUS: building shadow accounts"
      # # puts "\n"*5

      current_user.build_shadow_accounts
      @user = current_user
      render 'show.json.jbuilder'
    else
      # # puts "\n"*5
      # # puts "NOT BUILDING SHADOW ACCOUNTS"
      # # puts "\n"*5

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
