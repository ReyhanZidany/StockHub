class AddMetadataToStockMovements < ActiveRecord::Migration[8.1]
  def change
    add_column :stock_movements, :metadata, :jsonb
  end
end
