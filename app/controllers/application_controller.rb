class ApplicationController < ActionController::API
  include Pundit::Authorization

  before_action :authenticate_request
  attr_reader :current_user

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  private

  def authenticate_request
    header = request.headers['Authorization']
    header = header.split(' ').last if header
    
    begin
      decoded = Auth::JsonWebToken.decode(header)
      @current_user = User.find(decoded[:user_id])
    rescue ActiveRecord::RecordNotFound, JWT::DecodeError
      render json: { errors: 'Unauthorized' }, status: :unauthorized
    end
  end

  def user_not_authorized
    render json: { error: "You are not authorized to perform this action." }, status: :forbidden
  end

  def record_activity(action, record, details = nil)
    AuditLog.create(
      user: current_user,
      action: action,
      record_type: record.class.name,
      record_id: record.id,
      details: details || "#{action} #{record.class.name}"
    )
  end
end