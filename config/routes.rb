Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :products do
        post :add_stock, on: :member
        post :reduce_stock, on: :member
        post :adjust_stock, on: :member
      end

      resources :stock_movements, only: [:index]
    end
  end
end
