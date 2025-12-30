module Api
  module V1
    class StockMovementsController < ApplicationController
      def index
        # 1. Query Dasar: Ambil data dan join tabel Product (biar ringan)
        movements = StockMovement.includes(:product).order(created_at: :desc)

        # 2. Filter Tanggal (Jika parameter dikirim dari Frontend)
        if params[:start_date].present? && params[:end_date].present?
          # Konversi string tanggal menjadi format waktu (Awal hari s/d Akhir hari)
          start_date = Date.parse(params[:start_date]).beginning_of_day
          end_date = Date.parse(params[:end_date]).end_of_day
          
          movements = movements.where(created_at: start_date..end_date)
        end

        # 3. Filter Tipe Transaksi (IN, OUT, ADJUST)
        if params[:type].present? && params[:type] != 'ALL'
          movements = movements.where(movement_type: params[:type])
        end

        render json: movements.map { |m|
          {
            id: m.id,
            product: m.product.name,      # Langsung ambil nama produk
            sku: m.product.sku,           # Langsung ambil SKU
            quantity: m.quantity,
            type: m.movement_type,        # Pastikan kolom di DB namanya 'movement_type'
            date: m.created_at,
            user: (m.respond_to?(:user) && m.user) ? m.user.email : "System" 
          }
        }
      end
    end
  end
end