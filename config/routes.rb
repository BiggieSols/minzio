Teamprofile::Application.routes.draw do
  match 'auth/:provider/callback' => 'sessions#create_from_linkedin'
  resources :users

  resources :personality_types

  resources :quiz, only: [:show]

  resources :group_members, only: [:create, :destroy]
  
  resources :user_answers, only: [:index, :create]

  resources :groups

  resource :session

  match 'signout', to: 'sessions#destroy', as: 'signout'

  root to: "sessions#new"
end