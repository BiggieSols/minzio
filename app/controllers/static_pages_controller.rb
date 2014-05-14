class StaticPagesController < ApplicationController
  skip_before_filter :require_login
  
  def empty
    render json: {}
  end
end
