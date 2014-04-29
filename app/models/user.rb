class User < ActiveRecord::Base
  # serialize :description, JSON
  attr_accessible :name, :uid, :provider, :email, :description, :headline, :image_url, :location, :industry, :pub_profile, :access_token, :access_token_secret, :session_token, :password_digest, :password, :password_confirmation

  before_validation :set_password_digest, on: :create
  
  validate :password_matches_confirmation

  attr_accessor :password, :password_confirmation

  def self.from_omniauth(auth_hash)
    user = User.where(uid: auth_hash["uid"]).first_or_initialize
    user.uid                  = auth_hash["uid"]
    user.provider             = auth_hash["provider"]
    user.access_token         = auth_hash["credentials"]["token"]
    user.access_token_secret  = auth_hash["credentials"]["secret"]
    user.name                 = auth_hash["info"]["name"]
    user.email                = auth_hash["info"]["email"]
    user.location             = auth_hash["info"]["location"]
    user.headline             = auth_hash["info"]["headline"]
    user.industry             = auth_hash["info"]["industry"]
    user.image_url            = auth_hash["info"]["image"]
    user.pub_profile          = auth_hash["info"]["urls"]["public_profile"]
    user.save!
    user
  end

  def self.find_by_credentials(params={email: nil, password: nil})
    user = User.find_by_email(params[:email]);
    return user if user && user.is_password?(params[:password])
    nil
  end

  def set_session_token
    self.session_token = SecureRandom.urlsafe_base64(16);
  end

  def reset_session_token!
    set_session_token
    save!
  end

  def set_password_digest
    self.password_digest = BCrypt::Password.create(self.password) if self.password
  end

  def is_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end

  def linkedin
    @client ||= LinkedIn::Client.new(ENV["LINKEDIN_KEY"], ENV["LINKEDIN_SECRET"])
    @client.authorize_from_access(self.access_token, self.access_token_secret)
    @client

    # TODO: auto-create accounts for connections. @client.connections gives a set of hash-like LinkedIn Objects
  end

  def password_matches_confirmation
    if self.password && self.password != self.password_confirmation
      errors.add(:password, "password does not match confirmation")
    end
  end
end
