module Inventory
  class AddStock
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

      ActiveRecord::Base.transaction do
        product.update!(stock: product.stock + quantity)

        @movements.create!(
          product: product,
          quantity: quantity,
          movement_type: "IN"
        )
      end

      product
    end
  end
end
