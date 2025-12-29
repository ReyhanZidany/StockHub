module Api
  module V1
    class StockMovementsController < ApplicationController
      def index
        movements = StockMovement
          .includes(:product)
          .order(created_at: :desc)

        render json: movements.as_json(
          include: { product: { only: [:name, :sku] } }
        )
      end
    end
  end
end
