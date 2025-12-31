class JournalLineItem < ApplicationRecord
  belongs_to :journal_entry
  belongs_to :account
end
