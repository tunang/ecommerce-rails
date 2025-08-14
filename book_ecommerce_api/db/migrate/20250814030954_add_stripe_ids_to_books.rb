class AddStripeIdsToBooks < ActiveRecord::Migration[8.0]
  def change
    add_column :books, :stripe_product_id, :string
    add_column :books, :stripe_price_id, :string
  end
end
