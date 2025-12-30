class CreateAuditLogs < ActiveRecord::Migration[8.1]
  def change
    create_table :audit_logs do |t|
      t.references :user, null: false, foreign_key: true
      t.string :action
      t.string :record_type
      t.integer :record_id
      t.text :details

      t.timestamps
    end
  end
end
