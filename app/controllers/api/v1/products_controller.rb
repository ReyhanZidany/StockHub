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
        
        # LOGGING
        record_activity("CREATED", product, "Created new product: #{product.name}")

        render json: product, status: :created
      end

      def add_stock
        product = Product.find(params[:id])
        authorize product 

        updated_product = Inventory::AddStock.new.call(
          product_id: params[:id],
          quantity: params[:quantity].to_i,
          user: current_user
        )

        # LOGGING
        record_activity("ADD_STOCK", updated_product, "Added #{params[:quantity]} units to #{updated_product.name}")

        render json: updated_product
      end

      def reduce_stock
        product = Product.find(params[:id])
        authorize product 

        updated_product = Inventory::ReduceStock.new.call(
          product_id: params[:id],
          quantity: params[:quantity].to_i,
          user: current_user
        )

        # LOGGING
        record_activity("REDUCE_STOCK", updated_product, "Sold/Reduced #{params[:quantity]} units from #{updated_product.name}")

        render json: updated_product
      end

      def adjust_stock
        product = Product.find(params[:id])
        authorize product

        updated_product = Inventory::AdjustStock.new.call(
            product_id: params[:id],
            actual_stock: params[:actual_stock].to_i,
            user: current_user
        )

        # LOGGING
        record_activity("ADJUST_STOCK", updated_product, "Adjusted stock to #{params[:actual_stock]} for #{updated_product.name}")

        render json: updated_product
      end

      private

      def set_product
        @product = Product.find(params[:id])
      end

      def product_params
        # Pastikan :supplier_id ada di sini
        params.require(:product).permit(:name, :sku, :stock, :price, :supplier_id)
      end
    end
  end
end