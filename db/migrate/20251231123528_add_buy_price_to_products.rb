class AddBuyPriceToProducts < ActiveRecord::Migration[7.0]
  def change
    # Tambahkan default: 0 agar produk lama tidak error
    add_column :products, :buy_price, :decimal, precision: 15, scale: 2, default: 0
  end
end