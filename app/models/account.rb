class Account < ApplicationRecord
  has_many :journal_line_items
  
  validates :code, presence: true, uniqueness: true
  validates :name, presence: true
end