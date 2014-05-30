class StaticPagesController < ApplicationController
  skip_before_filter :require_login
  
  def empty
    render :status => 500
  end

  def landing
  end
end
