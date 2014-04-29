Teamprofile::Application.routes.draw do
  match 'auth/:provider/callback' => 'sessions#create'
end
