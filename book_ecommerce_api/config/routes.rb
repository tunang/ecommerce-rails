Rails.application.routes.draw do
  devise_for :users, path: '', path_names: {
    sign_in: 'login',
    sign_out: 'logout',
    registration: 'signup'
  },
  controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }

  resources :categories
  resources :books
  resources :authors
  resources :addresses
  resources :orders
  

  # Cart routes
  get    '/cart',          to: 'carts#show'
  post   '/cart/add',      to: 'carts#add_item'
  delete '/cart/remove/:id',   to: 'carts#remove_item'
  delete '/cart/clear',    to: 'carts#clear'

end
