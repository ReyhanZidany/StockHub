Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # --- AUTH ROUTES (FIXED) ---
      # Tambahkan "auth/" di depannya agar sesuai request frontend (/api/v1/auth/login)
      post "auth/login",    to: "auth#login"
      post "auth/register", to: "auth#register"
      post "auth/refresh",  to: "auth#refresh"
      
      # Route untuk update profile
      put  "profile",       to: "auth#update_profile"
      
      # --- RESOURCES LAINNYA ---
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

      # Accounting Routes
      get 'accounting/journals',    to: 'accounting#index'
      get 'accounting/profit_loss', to: 'accounting#profit_loss'
    end
  end
end