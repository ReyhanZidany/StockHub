module Inventory
  class ReduceStock
    def initialize(product_repository: Product, movement_repository: StockMovement)
      @products = product_repository
      @movements = movement_repository
    end

    def call(product_id:, quantity:, user: nil)
      raise ArgumentError, "Quantity must be positive" if quantity <= 0

      ActiveRecord::Base.transaction do
        # PENTING: Gunakan .lock sebelum find agar data tidak disentuh proses lain
        product = @products.lock.find(product_id)

        if product.stock < quantity
          raise ArgumentError, "Insufficient stock for #{product.name} (Requested: #{quantity}, Available: #{product.stock})"
        end

        product.stock -= quantity
        product.save!

        @movements.create!(
          product: product,
          quantity: quantity,
          movement_type: "OUT",
          user: user
        )

        product
      end
    end
  end
end