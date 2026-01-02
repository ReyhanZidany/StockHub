module Accounting
  class RecordJournal
    ACCOUNTS = {
      cash: '1000',
      inventory: '1100',
      payable: '2000',
      revenue: '4000',
      cogs: '5000'
    }

    def call(stock_movement:)
      @acc_cash      = Account.find_by!(code: ACCOUNTS[:cash])
      @acc_inventory = Account.find_by!(code: ACCOUNTS[:inventory])
      @acc_revenue   = Account.find_by!(code: ACCOUNTS[:revenue])
      @acc_cogs      = Account.find_by!(code: ACCOUNTS[:cogs])

      product = stock_movement.product
      quantity = stock_movement.quantity
      total_value = quantity * product.price

      ActiveRecord::Base.transaction do
        journal = JournalEntry.create!(
          date: stock_movement.created_at,
          description: generate_description(stock_movement),
          reference: stock_movement,
          user: stock_movement.user
        )

        if stock_movement.movement_type == 'OUT'
          create_line(journal, @acc_cash, debit: total_value)
          
          create_line(journal, @acc_revenue, credit: total_value)

        modal_per_unit = product.buy_price > 0 ? product.buy_price : (product.price * 0.7)
        cogs_value = quantity * modal_per_unit
          create_line(journal, @acc_inventory, credit: cogs_value)

          create_line(journal, @acc_cogs, debit: cogs_value)

        elsif stock_movement.movement_type == 'IN'
          create_line(journal, @acc_inventory, debit: total_value)

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