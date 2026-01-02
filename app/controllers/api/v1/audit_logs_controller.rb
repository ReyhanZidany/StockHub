module Api
  module V1
    class AuditLogsController < ApplicationController
      def index
        if current_user.role != 'admin'
          return render json: { error: 'Unauthorized' }, status: :forbidden
        end

        logs = AuditLog.includes(:user).order(created_at: :desc).limit(50)
        
        render json: logs.map { |log|
          {
            id: log.id,
            user: log.user.email,
            role: log.user.role,
            action: log.action,
            details: log.details,
            created_at: log.created_at
          }
        }
      end
    end
  end
end