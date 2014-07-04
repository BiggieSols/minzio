class CompaniesController < ApplicationController
  skip_before_filter :require_login

  def index
    companies_query = User.select("company_id, count(*)")
                    .group("company_id")
                    .order("count(*) desc")
                    .limit(100)
    @companies = Company.find(companies_query.map(&:company_id))
  end

  def show
    @company = Company.find(params[:id])
    @users = @company.users
  end
end
