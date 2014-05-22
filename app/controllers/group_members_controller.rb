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
    puts "\n"*5
    puts "params are: #{params}"
    puts "\n"*5
    user_id  = params[:user_id]
    group_id = params[:group_id]
    group = Group.find(group_id)

    self_removal      = params[:user_id].to_i == current_user.id
    non_admin_removal = user_id != group.admin_id
    user_is_admin     = group.admin_id == current_user.id

    # server side security check to prevent unauthorized member delete requests OR deletion of group admin
    # if group.admin_id == current_user.id && user_id != group.admin_id
    if non_admin_removal && (user_is_admin || self_removal)
      group_member = GroupMember.find_by_user_id_and_group_id(user_id, group_id)
      group_member.destroy #if group_member #(error handling)
    end
    render json: group_member
  end
end
