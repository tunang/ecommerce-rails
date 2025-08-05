class CreateOrders < ActiveRecord::Migration[7.0]
  def change
    create_table :orders do |t|
      t.references :user, null: false, foreign_key: true
      t.string :order_number, null: false
      t.integer :status, default: 0, null: false
      t.decimal :subtotal, precision: 10, scale: 2, null: false
      t.decimal :tax_amount, precision: 10, scale: 2, default: 0
      t.decimal :shipping_cost, precision: 10, scale: 2, default: 0
      t.decimal :total_amount, precision: 10, scale: 2, null: false
      t.references :shipping_address, null: false, foreign_key: { to_table: :addresses }
      t.string :payment_method
      t.string :payment_status
      t.string :tracking_number
      t.text :notes

      t.timestamps
    end

    add_index :orders, :order_number, unique: true
    add_index :orders, [:user_id, :status]
  end
end
