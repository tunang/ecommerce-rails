class OrdersController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show] # ✅ Kiểm tra token trước mọi action
  before_action :set_order, only: %i[show update destroy]
  before_action :authorize_order, only: %i[show update destroy]

  def index
    @orders = current_user.orders
    render json: @orders, status: :ok
  end

  def show
    render json: @order, status: :ok
  end

  def create
    ActiveRecord::Base.transaction do
      cart_items = current_user.cart_items.includes(:book)
      
      raise ActiveRecord::RecordNotFound, 'Cart is empty' if cart_items.empty?

      subtotal = cart_items.sum { |item| item.book.price * item.quantity }
      tax_amount = subtotal * 0.1
      shipping_cost = 5
      total_amount = subtotal + tax_amount + shipping_cost
      order =
        current_user.orders.create!(  
          order_number: SecureRandom.hex(10).upcase,
          status: 0,
          subtotal: subtotal,
          tax_amount: tax_amount,
          shipping_cost: shipping_cost,
          total_amount: total_amount,
          shipping_address_id: order_params[:shipping_address_id],
          payment_method: order_params[:payment_method],
          payment_status: 'pending',
          tracking_number: nil,
          notes: order_params[:notes],
        )

      cart_items.each do |item|
        unit_price = item.book.price
        quantity = item.quantity
        total_price = unit_price * quantity

        OrderItem.create!(
          order: order,
          book: item.book,
          quantity: quantity,
          unit_price: unit_price,
          total_price: total_price,
        )
      end

      cart_items.destroy_all

      render json: {
               status: {
                 code: 201,
                 message: 'Order created successfully',
               },
               order: OrderSerializer.new(order).as_json,
             },
             status: :created
    end
  rescue ActiveRecord::RecordInvalid => e
    render json: {
             error: e.record.errors.full_messages,
           },
           status: :unprocessable_entity
  rescue => e
    render json: { error: e.message }, status: :bad_request
  end

  
  def update
    if @order.update(order_params)
         render json: {
               status: {
                 code: 201,
                 message: 'Order created successfully',
               },
               order: OrderSerializer.new(@order).as_json,
             },
             status: :created
    else
      render json: {
               errors: @order.errors.full_messages,
             },
             status: :unprocessable_entity
    end
  end

  def destroy
    @order.destroy
    render json: {
                status: {
                  code: 201,
                  message: 'Order created successfully',
                },
                order: OrderSerializer.new(@order).as_json,
              },
              status: :created
  end

  private

  def set_order
    @order = Order.find(params[:id])
  end

  def authorize_order
    authorize @order
  end

  def order_params
    params.require(:order).permit(:shipping_address_id, :payment_method, :notes)
  end
end
