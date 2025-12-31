module Accounting
  class RecordJournal
    # Mapping Kode Akun (Sesuai seed yang kita buat kemarin)
    ACCOUNTS = {
      cash: '1000',      # Kas / Bank
      inventory: '1100', # Persediaan Barang
      payable: '2000',   # Hutang (Untuk pembelian kredit)
      revenue: '4000',   # Pendapatan Penjualan
      cogs: '5000'       # HPP (Harga Pokok Penjualan)
    }

    def call(stock_movement:)
      # Cari akun-akun di database berdasarkan kode
      @acc_cash      = Account.find_by!(code: ACCOUNTS[:cash])
      @acc_inventory = Account.find_by!(code: ACCOUNTS[:inventory])
      @acc_revenue   = Account.find_by!(code: ACCOUNTS[:revenue])
      @acc_cogs      = Account.find_by!(code: ACCOUNTS[:cogs])

      product = stock_movement.product
      quantity = stock_movement.quantity
      total_value = quantity * product.price # Asumsi: price adalah harga jual saat ini

      ActiveRecord::Base.transaction do
        # Buat Header Jurnal
        journal = JournalEntry.create!(
          date: stock_movement.created_at,
          description: generate_description(stock_movement),
          reference: stock_movement, # Link ke StockMovement
          user: stock_movement.user
        )

        # LOGIKA DEBIT/KREDIT
        if stock_movement.movement_type == 'OUT'
          # === SKENARIO PENJUALAN ===
          # 1. Terima Uang (Debit Kas)
          create_line(journal, @acc_cash, debit: total_value)
          
          # 2. Akui Pendapatan (Kredit Revenue)
          create_line(journal, @acc_revenue, credit: total_value)

          # 3. Kurangi Nilai Persediaan (Kredit Inventory)
          # Note: Idealnya pakai 'cost_price', tapi sementara kita pakai estimasi 70% dari harga jual sebagai modal
        modal_per_unit = product.buy_price > 0 ? product.buy_price : (product.price * 0.7)
        cogs_value = quantity * modal_per_unit
          create_line(journal, @acc_inventory, credit: cogs_value)

          # 4. Catat Beban Pokok (Debit HPP)
          create_line(journal, @acc_cogs, debit: cogs_value)

        elsif stock_movement.movement_type == 'IN'
          # === SKENARIO PEMBELIAN/RESTOCK ===
          # 1. Tambah Persediaan (Debit Inventory)
          create_line(journal, @acc_inventory, debit: total_value)

          # 2. Keluar Uang (Kredit Kas)
          create_line(journal, @acc_cash, credit: total_value)
        end
      end
    end

    private

    def create_line(journal, account, debit: 0, credit: 0)
      JournalLineItem.create!(
        journal_entry: journal,
        account: account,
        debit: debit,
        credit: credit
      )
    end

    def generate_description(movement)
      type = movement.movement_type == 'OUT' ? "Sales" : "Restock"
      "#{type}: #{movement.product.name} (Qty: #{movement.quantity})"
    end
  end
end