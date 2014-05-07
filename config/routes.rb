Teamprofile::Application.routes.draw do
  match 'auth/:provider/callback' => 'sessions#create_from_linkedin'

  resources :user_answers, only: [:index, :create]

  resource :session

  resources :users

  resources :quiz, only: [:show]

  root to: "sessions#new"
end