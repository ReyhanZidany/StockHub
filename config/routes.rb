Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      post "auth/login",    to: "auth#login"
      post "auth/register", to: "auth#register"
      post "auth/refresh",  to: "auth#refresh"
      get  "profile",       to: "auth#show"
      get  "auth/profile",  to: "auth#show" 
      get  "auth/me",       to: "auth#show"
      
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
      
      get 'accounting/journals',    to: 'accounting#journals'
      get 'accounting/profit_loss', to: 'accounting#profit_loss'
    end
  end
end