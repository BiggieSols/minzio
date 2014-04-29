class User < ActiveRecord::Base
  attr_accessible :description, :email, :first_name, :headling, :industry, :last_name, :provider, :pub_profile, :uid
end
