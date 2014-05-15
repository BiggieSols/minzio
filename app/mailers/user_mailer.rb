class UserMailer < ActionMailer::Base
  default from: "sol@teamglide.com"

  def welcome_email(user)
    @user           = user
    @url            = 'http://www.teamglide.com'
    mail(to: user.email, subject: 'Welcome to TeamGlide!')
  end


  def group_invitation(from_user, to_user, group)
    @from_user      = user
    @to_user        = to_user
    @url            = 'http://www.teamglide.com'
    mail(to: to_user.email, subject: 'Welcome to TeamGlide!')
  end

  def invitee_profile_completion(inviting_user, invited_user)
    @inviting_user  = inviting_user
    @invited_user   = invited_user
    mail(to: @inviting_user.email, subject: "New personality results available for #{invited_user.name}!")
  end
end