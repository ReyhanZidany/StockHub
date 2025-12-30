module Inventory
  class AddStock
    def initialize(product_repository: Product, movement_repository: StockMovement)
      @products = product_repository
      @movements = movement_repository
    end

    def call(product_id:, quantity:, user: nil)
      raise ArgumentError, "Quantity must be positive" if quantity <= 0

      ActiveRecord::Base.transaction do
        product = @products.lock.find(product_id)
        
        product.stock += quantity
        product.save!

        @movements.create!(
          product: product,
          quantity: quantity,
          movement_type: "IN",
          user: user
        )

        product
      end
    end
  end
end