class TipsController < ApplicationController
  def show
    @tip = Tip.find(params[:id])
    render 'show.json.jbuilder'
  end

  def create

    # converting "manager" to "as_manager" for database
    params[:tip][:relationship_type] = "as_" + params[:tip][:relationship_type]
    params[:tip][:author_user_id] = current_user.id

    # puts "\n"*10
    # puts params
    # puts "\n"*10
    
    @tip = Tip.new(params[:tip])
    @tip.save
    render 'show.json.jbuilder'
  end

  def destroy
  end
end
