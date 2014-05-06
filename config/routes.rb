Teamprofile::Application.routes.draw do
  match 'auth/:provider/callback' => 'sessions#create_from_linkedin'

  resource :session

  resources :users

  resources :quiz, only: [:show]
end
