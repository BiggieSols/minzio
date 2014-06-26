class TipsController < ApplicationController
  def show
    @tip = Tip.find(params[:id])
    render 'show.json.jbuilder'
  end

  def create

    # converting "manager" to "as_manager" for database
    params[:tip][:relationship_type] = "as_" + params[:tip][:relationship_type]
    params[:tip][:author_user_id] = current_user.id

    puts "\n"*10
    puts params
    puts "\n"*10
    
    @tip = Tip.new(params[:tip])
    @tip.save
    TipVote.create(vote_value: 1, tip_id: @tip.id, user_id: current_user.id)
    @tip.send_creation_notification

    render 'show.json.jbuilder'
  end

  def update
    @tip = Tip.find(params[:id])

    if [@tip.author_id, @tip.custom_personality.user_id].include? current_user.id
      @tip.update_attributes(text: params[:text])
      @tip.tip_votes.destroy_all
    end
    # TipVote.create(vote_value: 1, tip_id: @tip.id, user_id: current_user.id)
    # @tip.reload
    render 'show.json.jbuilder'
  end

  def destroy
    @tip = Tip.find(params[:id])
    @tip.hidden = true
    @tip.save
    @tip.send_deletion_notification(deleting_user: current_user)
    render 'show.json.jbuilder'
  end
end
