class CreateJournalEntries < ActiveRecord::Migration[7.1]
  def change
    create_table :journal_entries do |t|
      t.datetime :date, null: false, default: -> { 'CURRENT_TIMESTAMP' }
      t.string :description
      
      # Polymorphic: Bisa connect ke StockMovement, Invoice, dll
      t.references :reference, polymorphic: true, null: true 
      t.references :user, null: true, foreign_key: true

      t.timestamps
    end
  end
end