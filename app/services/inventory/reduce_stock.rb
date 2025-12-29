module Inventory
  class ReduceStock
    def initialize(
      product_repository: Product,
      movement_repository: StockMovement
    )
      @products = product_repository
      @movements = movement_repository
    end

    def call(product_id:, quantity:)
      raise ArgumentError, "Quantity must be positive" if quantity <= 0

      product = @products.find(product_id)
      raise ArgumentError, "Insufficient stock" if product.stock < quantity

      ActiveRecord::Base.transaction do
        product.update!(stock: product.stock - quantity)

        @movements.create!(
          product: product,
          quantity: quantity,
          movement_type: "OUT"
        )
      end

      product
    end
  end
end
