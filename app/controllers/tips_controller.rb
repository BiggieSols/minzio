class TipsController < ApplicationController
  def show
    @tip = Tip.find(params[:id])
    render 'show.json.jbuilder'
  end

  def create
    tip = Tip.new(text: params[:text])
  end

  def destroy
  end
end
