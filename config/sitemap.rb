# to run: rake sitemap:refresh

# Set the host name for URL creation
SitemapGenerator::Sitemap.default_host = "http://www.minzio.com"

SitemapGenerator::Sitemap.create do

  # User.find_each do |user|
  #   add user_path(user), lastmod: user.updated_at
  # end

  User.where(account_active: true).each do |user|
    add user_path(user), lastmod: user.updated_at, priority: 0.6
  end

  User.where(account_active: false).each do |user|
    add user_path(user), lastmod: user.updated_at, priority: 0.3
  end

  JobTitle.find_each do |job_title|
    add job_title_path(job_title), lastmod: job_title.updated_at
  end

  Company.find_each do |company|
    add company_path(company), lastmod: company.updated_at
  end

  add companies_path, :priority => 0.7, :changefreq => 'daily'
  add job_titles_path, :priority => 0.7, :changefreq => 'daily'

  # Put links creation logic here.
  #
  # The root path '/' and sitemap index file are added automatically for you.
  # Links are added to the Sitemap in the order they are specified.
  #
  # Usage: add(path, options={})
  #        (default options are used if you don't specify)
  #
  # Defaults: :priority => 0.5, :changefreq => 'weekly',
  #           :lastmod => Time.now, :host => default_host
  #
  # Examples:
  #
  # Add '/articles'
  #
  #   add articles_path, :priority => 0.7, :changefreq => 'daily'
  #
  # Add all articles:
  #
  #   Article.find_each do |article|
  #     add article_path(article), :lastmod => article.updated_at
  #   end
end
