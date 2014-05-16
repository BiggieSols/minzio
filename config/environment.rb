# Load the rails application
require File.expand_path('../application', __FILE__)

# Initialize the rails application
Teamprofile::Application.initialize!


if Rails.env.production?
  # only send real emails in production; use Mandrill
  ActionMailer::Base.smtp_settings = {
    :address              => "smtp.mandrillapp.com",
    :port                 => 25, # ports 587 and 2525 are also supported with STARTTLS
    :enable_starttls_auto => true, # detects and uses STARTTLS
    :user_name            => ENV["MANDRILL_USERNAME"],
    :password             => ENV["MANDRILL_PASSWORD"], # SMTP password is any valid API key
    :authentication       => 'login', # Mandrill supports 'plain' or 'login'
    :domain               => 'teamglide.com', # your domain to identify your server when connecting
  }
  ActionMailer::Base.delivery_method ||= :smtp
elsif Rails.env.development?
  ActionMailer::Base.delivery_method = :letter_opener
end