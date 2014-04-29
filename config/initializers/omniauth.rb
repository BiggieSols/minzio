OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
  consumer_key = '75vgmmxw0pr8zf'
  consumer_secret = 'DJUTy2tE4XY1mtWc'

  provider :linkedin, consumer_key, consumer_secret
end
