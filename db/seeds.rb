# db/seeds.rb

puts "🌱 Seeding Accounts..."

Account.create!([
  { code: '1000', name: 'Cash / Bank', account_type: 'ASSET', normal_balance: 'DEBIT' },
  { code: '1100', name: 'Inventory Asset', account_type: 'ASSET', normal_balance: 'DEBIT' },
  { code: '2000', name: 'Accounts Payable', account_type: 'LIABILITY', normal_balance: 'CREDIT' },
  { code: '4000', name: 'Sales Revenue', account_type: 'REVENUE', normal_balance: 'CREDIT' },
  { code: '5000', name: 'Cost of Goods Sold (HPP)', account_type: 'EXPENSE', normal_balance: 'DEBIT' }
])

puts "✅ Accounts created successfully!"