OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
  consumer_key = ENV['LINKEDIN_KEY']
  consumer_secret = ENV['LINKEDIN_SECRET']
  scope = "r_fullprofile r_emailaddress r_network w_messages"

  provider :linkedin, consumer_key, consumer_secret, scope: scope
end
