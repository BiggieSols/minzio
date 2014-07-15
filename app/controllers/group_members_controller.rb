class GroupMembersController < ApplicationController
  def create
    # puts params
    user_id           = params[:user_id]
    group_id          = params[:group_id]
    message_text      = params[:message_text]
    message_subject   = params[:message_subject]

    # clean message text
    if !message_text.downcase.index("www.minzio.com")
      message_text += " -- http://www.minzio.com"
    end

    ActiveRecord::Base.transaction do
      User.find(user_id).touch
      # already_exists  = !!GroupMember.find_by_user_id_and_group_id(user_id, group_id)
      group_member    = GroupMember.where(user_id: user_id, group_id: group_id).first_or_create

      invite          = Invitation.create( 
                                          from_user_id: current_user.id, 
                                          to_user_id: user_id, 
                                          group_id: params[:group_id], 
                                          message: message_text, 
                                          subject: message_subject,
                                          source: "LinkedIn"
                                         )
      invite.handle_message
      render json: group_member
    end
  end

  def destroy
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

      # TODO: move this to a separate removal class?
      # NOTE: only sends a message to users who are currently using active
      if User.find(user_id).account_active && user_id.to_i != current_user.id #don't send message for self-removal from group
        UserMailer.delay.group_removal(from_user: current_user, to_user: User.find(user_id), group: Group.find(group_id))
      end

    end
    render json: group_member
  end
end
