Teamprofile::Application.routes.draw do
  match 'auth/:provider/callback' => 'sessions#create_from_linkedin'

  resource :session

  resources :users

  match 'test/:test_name' => 'tests#show'
end
