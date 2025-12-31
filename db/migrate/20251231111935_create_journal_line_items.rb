class CreateJournalLineItems < ActiveRecord::Migration[7.1]
  def change
    create_table :journal_line_items do |t|
      t.references :journal_entry, null: false, foreign_key: true
      t.references :account, null: false, foreign_key: true
      
      # Default 0 biar perhitungannya gampang
      t.decimal :debit, precision: 15, scale: 2, default: 0
      t.decimal :credit, precision: 15, scale: 2, default: 0

      t.timestamps
    end
  end
end