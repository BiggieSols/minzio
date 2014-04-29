class SessionsController < ApplicationController
  def create
    auth_hash = request.env['omniauth.auth']
    User.from_omniauth auth_hash
    render json: auth_hash
  end
end
