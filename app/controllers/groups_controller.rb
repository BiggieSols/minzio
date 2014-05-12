class GroupsController < ApplicationController
  def index
    # NOT WORKING FOR SOME REASON...
    # @groups = current_user.groups(
    #   include: [:members => :personality_type]
    # )
    
    # FIX N+1 query, but now it's still 2 queries instead of 1. try to fix this later
    @groups = Group.where(id: current_user.groups.pluck(:id)).includes(:members =>[:personality_type])
    # # u.groups
    render 'index.json.jbuilder'
  end

  def show
    @group = Group.find(params[:id])
    render 'show.json.jbuilder'
  end

  def create
    puts params
    @group = Group.new
    @group = Group.new(name: params[:group][:name])
    @group.members << current_user
    @group.save
    # current_user.groups << @group
    # @group.reload
    render 'show.json.jbuilder'
  end
end
