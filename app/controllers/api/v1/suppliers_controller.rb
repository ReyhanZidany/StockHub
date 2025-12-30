module Api
  module V1
    class SuppliersController < ApplicationController
      before_action :set_supplier, only: [:show, :update, :destroy]

      # GET /api/v1/suppliers
      def index
        suppliers = Supplier.all.order(created_at: :desc)
        render json: suppliers
      end

      # GET /api/v1/suppliers/:id
      def show
        render json: @supplier
      end

      # POST /api/v1/suppliers
      def create
        # Hanya Admin yang boleh tambah supplier (Opsional, tergantung kebijakan)
        # authorize Supplier 
        
        supplier = Supplier.new(supplier_params)
        if supplier.save
          render json: supplier, status: :created
        else
          render json: { errors: supplier.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PUT /api/v1/suppliers/:id
      def update
        if @supplier.update(supplier_params)
          render json: @supplier
        else
          render json: { errors: @supplier.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/suppliers/:id
      def destroy
        @supplier.destroy
        head :no_content
      end

      private

      def set_supplier
        @supplier = Supplier.find(params[:id])
      end

      def supplier_params
        params.require(:supplier).permit(:name, :email, :phone, :address)
      end
    end
  end
end