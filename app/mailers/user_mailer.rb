class UserMailer < ActionMailer::Base
  default from: "\"The Minzio Team\" <sol@minzio.com>"
  default url:  "http://www.minzio.com"

  def admin_transfer(params = {from_user: nil, to_user: nil, group: nil})
    @from_user      = params[:from_user]
    @to_user        = params[:to_user]
    @group          = params[:group]
    mail(to: @to_user.email, subject: "You are now the admin for '#{@group.name}' on Minzio")
  end

  def group_deleted(params = {from_user: nil, to_user: nil, group: nil})
    @from_user      = params[:from_user]
    @to_user        = params[:to_user]
    @group          = params[:group]
    mail(to: @to_user.email, subject: "your group '#{@group.name}' was deleted on Mindsparrow")
  end

  def group_invitation(params = {from_user: nil, to_user: nil, group: nil})
    # puts "\n"
    # puts params[:to_user]
    # puts "\n"
    @from_user      = params[:from_user]
    @to_user        = params[:to_user]
    @group          = params[:group]
    mail(to: @to_user.email, subject: "#{@from_user.name} added you to a group on Minzio")
  end

  def group_removal(params = {from_user: nil, to_user: nil, group: nil})
    @from_user      = params[:from_user]
    @to_user        = params[:to_user]
    @group          = params[:group]
    mail(to: @to_user.email, subject: "You've been removed from the group '#{@group.name}' on Minzio")
  end

  def invitee_profile_completion(params = {inviting_user: nil, invited_user: nil, shared_groups: nil})
    # puts params
    @inviting_user  = params[:inviting_user]
    @invited_user   = params[:invited_user]
    @shared_groups  = params[:shared_groups]
    mail(to: @inviting_user.email, subject: "#{@invited_user.name} has new personality results on Minzio")
  end

  def tip_added(params = {from_user: nil, to_user: nil, tip: nil})
    @from_user      = params[:from_user]
    @to_user        = params[:to_user]
    @tip            = params[:tip]

    @from_user_name = @tip.anonymous ? "Someone" : @from_user.name

    mail(to: @to_user.email, subject: "#{@from_user_name} added a tip about working with you on Minzio")
  end

  def tip_deleted(params = {from_user: nil, to_user: nil, tip: nil})
    @from_user      = params[:from_user]
    @to_user        = params[:to_user]
    @tip            = params[:tip]

    @from_user_name = @tip.anonymous ? "Someone" : @from_user.name

    mail(to: @to_user.email, subject: "#{@from_user_name} deleted a tip about working with you on Minzio")
  end

  def welcome_email(user)
    @user           = user
    @url            = 'http://www.minzio.com'
    mail(to: @user.email, subject: 'Thanks for joining Minzio. Now what?')
  end
end