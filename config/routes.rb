Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post "auth/login",    to: "auth#login"
      post "auth/register", to: "auth#register"
      post "auth/refresh",  to: "auth#refresh"
      
      put  "profile",       to: "auth#update_profile"
      
      resources :products do
        member do
          post :add_stock
          post :reduce_stock
          post :adjust_stock
        end
      end
      
      resources :stock_movements, only: [:index]
      resources :suppliers
      resources :audit_logs, only: [:index]
      resources :users, only: [:index, :create, :destroy]

      get 'accounting/journals',    to: 'accounting'
      get 'accounting/profit_loss', to: 'accounting'
    end
  end
end