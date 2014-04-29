class User < ActiveRecord::Base
  attr_accessible :description, :email, :first_name, :headling, :industry, :last_name, :provider, :pub_profile, :uid

  def self.from_omniauth(auth_hash)
    user = User.where(uid: auth_hash.uid).first_or_initialize
  end
end
