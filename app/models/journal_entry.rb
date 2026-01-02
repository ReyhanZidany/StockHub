class JournalEntry < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :reference, polymorphic: true, optional: true
  
  has_many :journal_line_items, dependent: :destroy
  
  validate :must_be_balanced

  private

  def must_be_balanced
    total_debit = journal_line_items.map(&:debit).sum
    total_credit = journal_line_items.map(&:credit).sum

    if total_debit != total_credit
      errors.add(:base, "Journal Entry is not balanced! (Debit: #{total_debit}, Credit: #{total_credit})")
    end
  end
end