class GroupsController < ApplicationController
  before_filter :require_login

  def index
    @groups = current_user.groups
                          .includes(
                            :members =>[:personality_type]
                          )
    
    render 'index.json.jbuilder'
  end

  def show
    @group = Group.find(params[:id])
    render 'show.json.jbuilder'
  end

  def create
    puts params
    @group = Group.new
    @group = Group.new(name: params[:group][:name], admin_id: current_user.id)
    @group.members << current_user
    @group.save
    # current_user.groups << @group
    # @group.reload
    render 'show.json.jbuilder'
  end

  def destroy
    @group = Group.find(params[:id])
    @group.destroy if @group.admin_id == current_user.id
    render 'show.json.jbuilder'
  end

  def update
    @group = Group.find(params[:id])

    admin_param = params[:group][:admin_id]

    current_user_valid  = @group.admin_id == current_user.id
    valid_admin_id      = !admin_param || @group.member_ids.include?(params[:group][:admin_id].to_i)

    # if @group.admin_id == current_user.id# && @group.name != params[:name] 
    if current_user_valid && valid_admin_id
      @group.update_attributes(params[:group])
    end

    render 'show.json.jbuilder'
  end
end