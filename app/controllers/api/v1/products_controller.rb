module Api
  module V1
    class ProductsController < ApplicationController
      def index
        authorize Product
        render json: Product.all.order(created_at: :desc)
      end

      def create
        authorize Product 
        
        product = Product.create!(product_params)
        render json: product, status: :created
      end

      def add_stock
        product = Product.find(params[:id])
        authorize product 

        updated_product = Inventory::AddStock.new.call(
          product_id: params[:id],
          quantity: params[:quantity].to_i
        )
        render json: updated_product
      end

      def reduce_stock
        product = Product.find(params[:id])
        authorize product 

        updated_product = Inventory::ReduceStock.new.call(
          product_id: params[:id],
          quantity: params[:quantity].to_i
        )
        render json: updated_product
      end

      def adjust_stock
        product = Product.find(params[:id])
        authorize product

        updated_product = Inventory::AdjustStock.new.call(
            product_id: params[:id],
            actual_stock: params[:actual_stock].to_i
        )
        render json: updated_product
      end

      private

      def set_product
        @product = Product.find(params[:id])
      end

      def product_params
        params.require(:product).permit(:name, :sku, :stock, :price, :supplier_id)
      end
    end
  end
end