module Api
  module V1
    class StockMovementsController < ApplicationController
      def index
        movements = StockMovement.includes(:product).order(created_at: :desc)

        if params[:start_date].present? && params[:end_date].present?
          start_date = Date.parse(params[:start_date]).beginning_of_day
          end_date = Date.parse(params[:end_date]).end_of_day
          
          movements = movements.where(created_at: start_date..end_date)
        end

        if params[:type].present? && params[:type] != 'ALL'
          movements = movements.where(movement_type: params[:type])
        end

        render json: movements.map { |m|
          {
            id: m.id,
            product: m.product.name,
            sku: m.product.sku,
            quantity: m.quantity,
            type: m.movement_type,
            date: m.created_at,
            user: (m.respond_to?(:user) && m.user) ? m.user.email : "System" 
          }
        }
      end
    end
  end
end