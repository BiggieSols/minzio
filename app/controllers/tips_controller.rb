class TipsController < ApplicationController
  def show
    @tip = Tip.find(params[:id])
    render 'show.json.jbuilder'
  end

  def create
  end

  def destroy
  end
end
