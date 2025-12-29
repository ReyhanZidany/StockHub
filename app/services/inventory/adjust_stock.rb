module Inventory
  class AdjustStock
    def initialize(
      product_repository: Product,
      movement_repository: StockMovement
    )
      @products = product_repository
      @movements = movement_repository
    end

    def call(product_id:, actual_stock:)
      raise ArgumentError, "Stock must be >= 0" if actual_stock < 0

      product = @products.find(product_id)
      difference = actual_stock - product.stock

      return product if difference.zero?

      ActiveRecord::Base.transaction do
        product.update!(stock: actual_stock)

        @movements.create!(
          product: product,
          quantity: difference.abs,
          movement_type: "ADJUST",
          metadata: {
            from: product.stock,
            to: actual_stock
          }
        )
      end

      product
    end
  end
end
