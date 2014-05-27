class UserMailer < ActionMailer::Base
  default from: "sol@mindsparrow.com"
  default url:  "http://www.mindsparrow.com"

  def welcome_email(user)
    @user           = user
    @url            = 'http://www.mindsparrow.com'
    mail(to: user.email, subject: 'Thanks for joining MindSparrow. Now what?')
  end

  def group_invitation(params = {from_user: nil, to_user: nil, group: nil})
    puts "\n"
    puts params[:to_user]
    puts "\n"
    @from_user      = params[:from_user]
    @to_user        = params[:to_user]
    @group          = params[:group]
    mail(to: @to_user.email, subject: "#{@to_user.name} added you to a group on MindSparrow")
  end

  def group_removal(params = {from_user: nil, to_user: nil, group: nil})
    @from_user      = params[:from_user]
    @to_user        = params[:to_user]
    @group          = params[:group]
    mail(to: @to_user.email, subject: "You've been removed from the group '#{@group.name}' on MindSparrow")
  end

  def group_deleted(params = {from_user: nil, to_user: nil, group: nil})
    @from_user      = params[:from_user]
    @to_user        = params[:to_user]
    @group          = params[:group]
    mail(to: @to_user.email, subject: "your group '#{@group.name}' was deleted on Mindsparrow")
  end

  def admin_transfer(params = {from_user: nil, to_user: nil, group: nil})
    @from_user      = params[:from_user]
    @to_user        = params[:to_user]
    @group          = params[:group]
    mail(to: @to_user.email, subject: "You are now the admin for '#{@group.name}' on MindSparrow")
  end

  def invitee_profile_completion(params = {inviting_user: nil, invited_user: nil})
    puts params
    @inviting_user  = params[:inviting_user]
    @invited_user   = params[:invited_user]
    mail(to: @inviting_user.email, subject: "#{@invited_user.name} has new personality results on MindSparrow")
  end
end