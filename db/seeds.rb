# db/seeds.rb

puts "Cleaning up database..."

# URUTAN PENTING: Hapus anak dulu (StockMovement), baru induk (Product/User)
StockMovement.destroy_all 
Product.destroy_all
User.destroy_all

puts "Creating Users..."

# 1. Admin (Bisa Semuanya)
admin = User.create!(
  email: 'admin@stockhub.com',
  password: 'password123',
  role: :admin
)

# 2. Manager (Bisa Adjust Stock, tapi GABISA Create Product baru)
manager = User.create!(
  email: 'manager@stockhub.com',
  password: 'password123',
  role: :manager
)

# 3. Staff (Cuma bisa Add/Reduce Stock harian)
staff = User.create!(
  email: 'staff@stockhub.com',
  password: 'password123',
  role: :staff
)

puts "Users Created!"
puts "Admin:   admin@stockhub.com   (Role: #{admin.role})"
puts "Manager: manager@stockhub.com (Role: #{manager.role})"
puts "Staff:   staff@stockhub.com   (Role: #{staff.role})"

puts "\nCreating Sample Products..."
Product.create!([
  { name: 'MacBook Pro M3', sku: 'MBP-M3-001', stock: 10, price: 25000000 },
  { name: 'Logitech MX Master', sku: 'LOG-MX-002', stock: 50, price: 1500000 },
  { name: 'Keychron K2', sku: 'KEY-K2-003', stock: 30, price: 1200000 }
])
puts "Done!"