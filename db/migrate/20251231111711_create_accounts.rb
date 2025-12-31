class CreateAccounts < ActiveRecord::Migration[7.1]
  def change
    create_table :accounts do |t|
      t.string :code, null: false, index: { unique: true } # Kode harus unik
      t.string :name, null: false
      t.string :account_type, null: false # Asset/Liability/dll
      t.string :normal_balance, null: false # 'DEBIT' atau 'CREDIT'
      
      t.timestamps
    end
  end
end