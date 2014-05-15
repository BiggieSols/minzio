class GroupMembersController < ApplicationController
  def create
    puts params
    user_id  = params[:user_id]
    group_id = params[:group_id]

    ActiveRecord::Base.transaction do
      User.find(user_id).touch
      group_member = GroupMember.create(user_id: user_id, group_id: group_id)
      invite = Invitation.create(from_user_id: current_user.id, to_user_id: user_id, group_id: params[:group_id], message: "")
      invite.send_message
      render json: group_member
    end
  end

  def destroy
    user_id  = params[:user_id]
    group_id = params[:group_id]
    group_member = GroupMember.find_by_user_id_and_group_id(user_id, group_id).destroy
    render json: group_member
  end
end
