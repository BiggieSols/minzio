class CompaniesController < ApplicationController
  skip_before_filter :require_login

  def index
    @companies = User.select("company, count(*)")
                    .group("company")
                    .order("count(*) desc")
                    .limit(100)
  end

  def show
    company = params[:company].gsub("_", " ")
    users = User.where(company: company)
  end
end
