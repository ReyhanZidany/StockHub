module Inventory
  class AdjustStock
    def initialize(
      product_repository: Product,
      movement_repository: StockMovement
    )
      @products = product_repository
      @movements = movement_repository
    end

    def call(product_id:, actual_stock:, user: nil)
      raise ArgumentError, "Stock must be >= 0" if actual_stock < 0

      ActiveRecord::Base.transaction do
        # 1. LOCK DULU baru ambil data
        product = @products.lock.find(product_id)

        # 2. Hitung selisih berdasarkan data yang sudah di-lock (paling update)
        old_stock = product.stock
        difference = actual_stock - old_stock

        # 3. Early return jika ternyata tidak ada perubahan
        return product if difference.zero?

        # 4. UPDATE STOK (Bagian ini yang tadi hilang)
        product.update!(stock: actual_stock)

        # 5. Catat Movement
        @movements.create!(
          product: product,
          quantity: difference.abs,
          movement_type: "ADJUST",
          user: user,
          metadata: {
            from: old_stock,
            to: actual_stock
          }
        )

        product
      end
    end
  end
end