class CreateProducts < ActiveRecord::Migration[8.1]
  def change
    create_table :products do |t|
      t.string :name
      t.string :sku
      t.integer :stock
      t.decimal :price

      t.timestamps
    end
  end
end
