class AddPaymentLinkToOrders < ActiveRecord::Migration[8.0]
  def change
    add_column :orders, :payment_link, :string
  end
end
