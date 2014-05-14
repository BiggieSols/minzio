class GroupMembersController < ApplicationController
  def create
    puts params
    user_id  = params[:user_id]
    group_id = params[:group_id]
    group_member = GroupMember.create(user_id: user_id, group_id: group_id)

    User.find(user_id).touch

    current_user.send_message(user_id, group_id)
    
    render json: group_member
  end

  def destroy
    user_id  = params[:user_id]
    group_id = params[:group_id]
    group_member = GroupMember.find_by_user_id_and_group_id(user_id, group_id).destroy
    render json: group_member
  end
end
