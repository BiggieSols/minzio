Teamprofile::Application.routes.draw do
  match 'auth/:provider/callback' => 'sessions#create_from_linkedin'

  resources :user_answers, only: [:index, :create]

  resource :session

  match 'signout', to: 'sessions#destroy', as: 'signout'

  resources :users

  resources :personality_types

  resources :quiz, only: [:show]

  root to: "sessions#new"
end