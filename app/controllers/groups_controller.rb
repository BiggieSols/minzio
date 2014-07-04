class GroupsController < ApplicationController
  before_filter :require_login

  def index
    @groups = current_user.groups
                          .includes(
                            :members =>[:personality_type, :answers],
                          )
    respond_to do |format|
      format.html { redirect_to empty_url(anchor: "groups") }
      format.json { render 'index.json.jbuilder' }
    end

  end

  def show
    @group = Group.find(params[:id])
    respond_to do |format|
      format.html { redirect_to empty_url(anchor: "groups/#{params[:id]}")}
      format.json { render 'show.json.jbuilder' }
    end
  end

  def create
    @group = Group.new
    @group = Group.new(name: params[:group][:name], admin_id: current_user.id)
    @group.members << current_user
    @group.save
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
    changed_admin_id    = @group.admin_id != admin_param

    if current_user_valid && valid_admin_id
      if @group.update_attributes(params[:group]) && changed_admin_id
        UserMailer.delay.admin_transfer(from_user: current_user, to_user: @group.admin, group: @group)
      end
    end

    render 'show.json.jbuilder'
  end
end