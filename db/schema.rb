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

ActiveRecord::Schema[8.1].define(version: 2025_12_30_155501) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

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

  create_table "products", force: :cascade do |t|
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
  add_foreign_key "products", "suppliers"
  add_foreign_key "stock_movements", "products"
  add_foreign_key "stock_movements", "users"
end
