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

  get 'empty', to: 'static_pages#empty'

  root to: "static_pages#landing"
end