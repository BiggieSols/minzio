class TipsController < ApplicationController
  include TipsHelper

  def show
    @tip = Tip.find(params[:id])
    render 'show.json.jbuilder'
  end

  def create
    # converting "manager" to "as_manager" for database
    params[:tip][:relationship_type]  = "as_" + params[:tip][:relationship_type]
    params[:tip][:author_user_id]     = current_user.id

    puts "\n"*10
    puts params
    puts "\n"*10
    
    @tip = Tip.new(params[:tip])

    if valid_tip_create_request?(@tip)
      @tip.save
      TipVote.create(vote_value: 1, tip_id: @tip.id, user_id: current_user.id)
      @tip.send_creation_notification
    end

    render 'show.json.jbuilder'
  end

  def update
    @tip = Tip.find(params[:id])

    if valid_tip_modify_request?(@tip)
      @tip.update_attributes(text: params[:text])
      @tip.tip_votes.destroy_all
    end
    # TipVote.create(vote_value: 1, tip_id: @tip.id, user_id: current_user.id)
    # @tip.reload
    render 'show.json.jbuilder'
  end

  def destroy
    @tip = Tip.find(params[:id])

    if valid_tip_modify_request?(@tip)
      @tip.hidden = true
      @tip.save
      @tip.send_deletion_notification(deleting_user: current_user)
    end
    render 'show.json.jbuilder'
  end
end
