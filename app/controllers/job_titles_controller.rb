class JobTitlesController < ApplicationController
  skip_before_filter :require_login

  def index
    jobs_query = User.select("job_title_id, count(*)")
                     .group("job_title_id")
                     .order("count(*) desc")
                     .limit(100)
    @jobs = JobTitle.find(jobs_query.map(&:job_title_id))
  end

  def show
    @job_title = JobTitle.find(params[:id])
    @users = @job_title.users
  end
end
