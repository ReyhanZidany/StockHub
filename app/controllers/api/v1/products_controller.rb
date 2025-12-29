module Api
  module V1
    class ProductsController < ApplicationController

      def index
        render json: Product.all
      end

      def create
        product = Product.create!(product_params)
        render json: product, status: :created
      end

      def add_stock
        product = Inventory::AddStock.new.call(
          product_id: params[:id],
          quantity: params[:quantity].to_i
        )
        render json: product
      end

      def reduce_stock
        product = Inventory::ReduceStock.new.call(
          product_id: params[:id],
          quantity: params[:quantity].to_i
        )
        render json: product
      end

      def adjust_stock
        product = Inventory::AdjustStock.new.call(
            product_id: params[:id],
            actual_stock: params[:actual_stock].to_i
        )

        render json: product
      end


      private

      def product_params
        params.require(:product).permit(:name, :sku, :stock, :price)
      end
    end
  end
end
