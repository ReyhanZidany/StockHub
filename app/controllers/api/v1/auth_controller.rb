module Api
  module V1
    class AuthController < ApplicationController
      skip_before_action :authenticate_request, only: [:login]

      def login
        user = User.find_by(email: params[:email])

        if user&.authenticate(params[:password])
          token = Auth::JsonWebToken.encode(user_id: user.id, role: user.role)
          
          render json: { 
            token: token,
            user: {
              id: user.id,
              email: user.email,
              role: user.role, 
              name: user.email.split('@')[0].capitalize
            }
          }
        else
          render json: { error: "Invalid credentials" }, status: :unauthorized
        end
      end
    end
  end
end