class ApplicationController < ActionController::Base
  before_filter :require_login
  
  include ApplicationHelper
  protect_from_forgery
end
