class SessionsController < ApplicationController
  def create
    result = request.env['omniauth.auth']
    render json: result
  end
end
