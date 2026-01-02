module Api
  module V1
    class AuthController < ApplicationController
      skip_before_action :authenticate_request, only: [:login, :refresh, :register]

      def login
        user = User.find_by(email: params[:email])

        if user&.authenticate(params[:password])
          token = Auth::JsonWebToken.encode(user_id: user.id, role: user.role)
          
          render json: { 
            token: token,
            refresh_token: token,
            user: {
              id: user.id,
              email: user.email,
              role: user.role, 
              name: user.name || user.email.split('@')[0].capitalize
            }
          }
        else
          render json: { error: "Invalid credentials" }, status: :unauthorized
        end
      end

      def refresh
        token = params[:refresh_token]
        
        if token.blank?
          return render json: { error: 'Refresh token is required' }, status: :unauthorized
        end

        begin
          decoded = Auth::JsonWebToken.decode(token)
          user = User.find(decoded[:user_id])
          
          new_token = Auth::JsonWebToken.encode(user_id: user.id, role: user.role)
          
          render json: { 
            token: new_token,
            refresh_token: new_token
          }
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'User not found' }, status: :unauthorized
        rescue JWT::DecodeError
          render json: { error: 'Invalid refresh token' }, status: :unauthorized
        end
      end

      def show
        render json: { 
          user: {
            id: @current_user.id,
            email: @current_user.email,
            name: @current_user.name,
            role: @current_user.role
          }
        }
      end

      def update_profile
        user = @current_user
        
        user.name = user_params[:name] if user_params[:name].present?
        user.email = user_params[:email] if user_params[:email].present?

        if params[:user][:new_password].present?
          if params[:user][:current_password].blank?
            return render json: { error: "Current password is required to set new password" }, status: :unprocessable_entity
          end

          unless user.authenticate(params[:user][:current_password])
            return render json: { error: "Current password is incorrect" }, status: :forbidden
          end

          user.password = params[:user][:new_password]
        end

        if user.save
          record_activity("PROFILE_UPDATE", user, "User updated profile info")
          
          render json: { 
            message: 'Profile updated successfully',
            user: { 
              id: user.id, 
              email: user.email, 
              role: user.role, 
              name: user.name 
            }
          }
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end
      
      def register
      end

      private

      def user_params
        params.require(:user).permit(:name, :email, :password)
      end

    end
  end
end