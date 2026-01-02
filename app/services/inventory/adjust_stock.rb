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
        product = @products.lock.find(product_id)

        old_stock = product.stock
        difference = actual_stock - old_stock

        return product if difference.zero?

        product.update!(stock: actual_stock)

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