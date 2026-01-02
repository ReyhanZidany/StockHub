module Api
  module V1
    class AccountingController < ApplicationController
      
      def journals 
        journals = JournalEntry.includes(:user, journal_line_items: :account)
                               .order(date: :desc)
                               .limit(100)

        render json: journals.map { |j|
          {
            id: j.id,
            date: j.date,
            description: j.description,
            reference: j.reference_type,
            user: j.user&.email || "System",
            total_amount: j.journal_line_items.sum(&:debit),
            lines: j.journal_line_items.map { |line|
              {
                account_code: line.account&.code || "N/A",
                account_name: line.account&.name || "Unknown Account",
                debit: line.debit,
                credit: line.credit
              }
            }
          }
        }
      end

      def profit_loss
        revenue = JournalLineItem.joins(:account).where(accounts: { code: '4000' }).sum(:credit)
        cogs = JournalLineItem.joins(:account).where(accounts: { code: '5000' }).sum(:debit)
        gross_profit = revenue - cogs
        margin = revenue > 0 ? ((gross_profit / revenue) * 100).round(2) : 0

        render json: {
          revenue: revenue,
          cogs: cogs,
          gross_profit: gross_profit,
          margin: margin
        }
      end
    end
  end
end