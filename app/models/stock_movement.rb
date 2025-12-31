class StockMovement < ApplicationRecord
  belongs_to :product
  belongs_to :user, optional: true 
  has_one :journal_entry, as: :reference
end