class GroupsController < ApplicationController
  def index
    @groups = current_user.groups
    render 'index.json.jbuilder'
  end

  def show
    @group = Group.find(params[:id])
    render 'show.json.jbuilder'
  end
end
