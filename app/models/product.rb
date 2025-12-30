class Product < ApplicationRecord
  belongs_to :supplier, optional: true 
  has_many :stock_movements, dependent: :destroy
  validates :name, :sku, presence: true
  validates :sku, uniqueness: true
  validates :stock, numericality: { greater_than_or_equal_to: 0 }
  validates :price, numericality: { greater_than: 0 }
end
