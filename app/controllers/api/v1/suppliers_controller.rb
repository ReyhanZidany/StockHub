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
        supplier = Supplier.new(supplier_params)
        if supplier.save
          # LOGGING
          record_activity("CREATED", supplier, "Added new supplier: #{supplier.name}")
          
          render json: supplier, status: :created
        else
          render json: { errors: supplier.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PUT /api/v1/suppliers/:id
      def update
        if @supplier.update(supplier_params)
          # LOGGING
          record_activity("UPDATED", @supplier, "Updated supplier info: #{@supplier.name}")

          render json: @supplier
        else
          render json: { errors: @supplier.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/suppliers/:id
      def destroy
        supplier_name = @supplier.name 
        
        @supplier.destroy
        # LOGGING
        record_activity("DELETED", @supplier, "Deleted supplier: #{supplier_name}")

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