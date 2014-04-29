class User < ActiveRecord::Base
  serialize :description, JSON
  attr_accessible :description, :email, :first_name, :headling, :industry, :last_name, :provider, :pub_profile, :uid

  def self.from_omniauth(auth_hash)
    user = User.where(uid: auth_hash["uid"]).first_or_initialize
    user.uid = auth_hash["uid"]
    user.provider = auth_hash["provider"]
    user.access_token = auth_hash["credentials"]["token"]
    user.access_token_secret = auth_hash["credentials"]["secret"]
    user.name = auth_hash["info"]["name"]
    user.email = auth_hash["info"]["email"]
    user.location = auth_hash["info"]["location"]
    user.headline = auth_hash["info"]["headline"]
    user.industry = auth_hash["info"]["industry"]
    user.image_url = auth_hash["info"]["image"]
    user.pub_profile = auth_hash["info"]["urls"]["public_profile"]

# "name", "email", "nickname", "first_name", "last_name", "location", "description", "image", "phone", "headline", "industry", "urls"


    # user.description = auth_hash[]
    user.save!
  end

  def linkedin
    @client ||= LinkedIn::Client.new(ENV["LINKEDIN_KEY"], ENV["LINKEDIN_SECRET"])
    @client.authorize_from_access(self.access_token, self.access_token_secret)
    @client

    # TODO: auto-create accounts for connections. @client.connections gives a set of hash-like LinkedIn Objects
  end
end
