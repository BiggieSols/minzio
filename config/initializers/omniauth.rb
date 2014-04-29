OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
  consumer_key = ENV['LINKEDIN_KEY']
  consumer_secret = ENV['LINKEDIN_SECRET']

  provider :linkedin, consumer_key, consumer_secret
end
