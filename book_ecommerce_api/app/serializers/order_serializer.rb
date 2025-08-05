class OrderSerializer
  def initialize(order)
    @order = order
  end

  def as_json(*)
    {
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      subtotal: order.subtotal,
      tax_amount: order.tax_amount,
      shipping_cost: order.shipping_cost,
      total_amount: order.total_amount,
      created_at: order.created_at,
      updated_at: order.updated_at,
      user_id: order.user_id
    }
  end

  private

  attr_reader :order
end
