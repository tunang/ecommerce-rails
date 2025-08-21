Rails
  .application
  .routes
  .draw do
    devise_for :users,
               path: '',
               path_names: {
                 sign_in: 'login',
                 sign_out: 'logout',
                 registration: 'signup',
               },
               controllers: {
                 confirmations: 'users/confirmations',
                 sessions: 'users/sessions',
                 registrations: 'users/registrations',
                 passwords: 'users/passwords'
               }

    devise_scope :user do
      post 'users/confirm', to: 'users/confirmations#confirm'
    end

    if Rails.env.development?
      mount LetterOpenerWeb::Engine, at: '/letter_opener'
    end
    #Book routes
    get '/books/search', to: 'books#search'

    resources :categories
    resources :books
    resources :authors
    resources :addresses
    resources :orders
    

    # Cart routes
    get '/cart', to: 'carts#show'
    post '/cart/add', to: 'carts#add_item'
    patch '/cart/update', to: 'carts#update_item'
    delete '/cart/remove/:id', to: 'carts#remove_item'
    delete '/cart/clear', to: 'carts#clear'

    #Admin order routes
    get '/orders/admin/get_all', to: 'orders#get_all'

    #Refresh token routes
    post '/refresh_token', to: 'refresh_tokens#create'

    #Sessiom route
    get '/me', to: 'users#me'

    #Category route
    get '/categories/user/get_nested_category',
        to: 'categories#get_nested_category'
    get '/categories/:id/products', to: 'books#get_books_by_category'

    #Stripe route
    post '/stripe/webhook', to: 'stripe_webhooks#receive'
    
    #Action cable route
    mount ActionCable.server => '/cable'

  end
