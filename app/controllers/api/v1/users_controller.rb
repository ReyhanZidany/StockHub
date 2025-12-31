module Api
  module V1
    class UsersController < ApplicationController
      # Pastikan hanya user login yang bisa akses
      before_action :authenticate_request
      before_action :set_user, only: [:destroy]

      # GET /api/v1/users (List semua user)
      def index
        # Ambil semua user, urutkan dari yang terbaru
        users = User.select(:id, :name, :email, :role, :created_at).order(created_at: :desc)
        render json: users
      end

      # POST /api/v1/users (Admin bikin user baru)
      def create
        user = User.new(user_params)
        
        if user.save
          # Log aktivitas
          record_activity("CREATE_USER", user, "Created new user: #{user.name} (#{user.role})")
          
          # Render tanpa mengirim password balik
          render json: { 
            message: "User created successfully", 
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
          }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/users/:id (Hapus user)
      def destroy
        # Cegah admin menghapus dirinya sendiri
        if @user.id == current_user.id
          return render json: { error: "You cannot delete your own account." }, status: :forbidden
        end

        @user.destroy
        record_activity("DELETE_USER", @user, "Deleted user: #{@user.email}")
        render json: { message: "User deleted successfully" }
      end

      private

      def set_user
        @user = User.find(params[:id])
      end

      def user_params
        params.require(:user).permit(:name, :email, :password, :role)
      end
    end
  end
end