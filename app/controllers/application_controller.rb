class ApplicationController < ActionController::API
  include Pundit::Authorization

  before_action :authenticate_request
  attr_reader :current_user

  # Handle error jika user memaksa akses fitur yang dilarang (Pundit)
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  # Helper untuk Audit Log (Dipakai di controller lain)
  def record_activity(action, record, details = nil)
    # Gunakan Safe Navigation (&.) jaga-jaga kalau current_user nil (misal cron job)
    AuditLog.create(
      user: current_user,
      action: action,
      record_type: record.class.name,
      record_id: record.id,
      details: details || "#{action} #{record.class.name}"
    )
  end

  private

  def authenticate_request
    header = request.headers['Authorization']
    
    # 1. Cek apakah Header ada?
    unless header
      render json: { errors: 'Missing Authorization Header' }, status: :unauthorized
      return
    end

    # 2. Ambil token setelah "Bearer "
    token = header.split(' ').last

    begin
      decoded = Auth::JsonWebToken.decode(token)

      # 3. [FIX UTAMA] Cek apakah hasil decode Valid?
      # Jika decoded NIL atau tidak punya user_id, tolak akses.
      if decoded.nil? || !decoded[:user_id]
        render json: { errors: 'Invalid Token Payload' }, status: :unauthorized
        return
      end

      @current_user = User.find(decoded[:user_id])
      
    rescue ActiveRecord::RecordNotFound
      render json: { errors: 'User not found' }, status: :unauthorized
    rescue JWT::DecodeError
      render json: { errors: 'Invalid Token' }, status: :unauthorized
    rescue => e
      # Tangkap error lain biar gak 500
      render json: { errors: "Authentication Error: #{e.message}" }, status: :unauthorized
    end
  end

  def user_not_authorized
    render json: { error: "You are not authorized to perform this action." }, status: :forbidden
  end
end