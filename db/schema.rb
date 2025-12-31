# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2025_12_31_123528) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "accounts", force: :cascade do |t|
    t.string "account_type", null: false
    t.string "code", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.string "normal_balance", null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_accounts_on_code", unique: true
  end

  create_table "audit_logs", force: :cascade do |t|
    t.string "action"
    t.datetime "created_at", null: false
    t.text "details"
    t.integer "record_id"
    t.string "record_type"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_audit_logs_on_user_id"
  end

  create_table "journal_entries", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "date", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.string "description"
    t.bigint "reference_id"
    t.string "reference_type"
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.index ["reference_type", "reference_id"], name: "index_journal_entries_on_reference"
    t.index ["user_id"], name: "index_journal_entries_on_user_id"
  end

  create_table "journal_line_items", force: :cascade do |t|
    t.bigint "account_id", null: false
    t.datetime "created_at", null: false
    t.decimal "credit", precision: 15, scale: 2, default: "0.0"
    t.decimal "debit", precision: 15, scale: 2, default: "0.0"
    t.bigint "journal_entry_id", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_journal_line_items_on_account_id"
    t.index ["journal_entry_id"], name: "index_journal_line_items_on_journal_entry_id"
  end

  create_table "products", force: :cascade do |t|
    t.decimal "buy_price", precision: 15, scale: 2, default: "0.0"
    t.datetime "created_at", null: false
    t.string "name"
    t.decimal "price"
    t.string "sku"
    t.integer "stock"
    t.bigint "supplier_id"
    t.datetime "updated_at", null: false
    t.index ["supplier_id"], name: "index_products_on_supplier_id"
  end

  create_table "stock_movements", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.jsonb "metadata"
    t.string "movement_type"
    t.bigint "product_id", null: false
    t.integer "quantity"
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.index ["product_id"], name: "index_stock_movements_on_product_id"
    t.index ["user_id"], name: "index_stock_movements_on_user_id"
  end

  create_table "suppliers", force: :cascade do |t|
    t.text "address"
    t.datetime "created_at", null: false
    t.string "email"
    t.string "name"
    t.string "phone"
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email"
    t.string "name"
    t.string "password_digest"
    t.integer "role"
    t.datetime "updated_at", null: false
  end

  add_foreign_key "audit_logs", "users"
  add_foreign_key "journal_entries", "users"
  add_foreign_key "journal_line_items", "accounts"
  add_foreign_key "journal_line_items", "journal_entries"
  add_foreign_key "products", "suppliers"
  add_foreign_key "stock_movements", "products"
  add_foreign_key "stock_movements", "users"
end
