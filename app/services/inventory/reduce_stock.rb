module Inventory
  class ReduceStock
    def initialize(product_repository: Product, movement_repository: StockMovement)
      @products = product_repository
      @movements = movement_repository
    end

    def call(product_id:, quantity:, user: nil)
      raise ArgumentError, "Quantity must be positive" if quantity <= 0

      ActiveRecord::Base.transaction do
        product = @products.lock.find(product_id)

        if product.stock < quantity
          raise ArgumentError, "Insufficient stock for #{product.name} (Requested: #{quantity}, Available: #{product.stock})"
        end

        product.stock -= quantity
        product.save!

        movement = @movements.create!( 
          product: product,
          quantity: quantity,
          movement_type: "OUT",
          user: user
        )

        Accounting::RecordJournal.new.call(stock_movement: movement)

        product
      end
    end
  end
end