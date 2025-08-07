class OrdersController < ApplicationController
  before_action :authenticate_user!, except: %i[index show] # ✅ Kiểm tra token trước mọi action
  before_action :set_order, only: %i[show update destroy]
  before_action :authorize_order, only: %i[show update destroy]

  def index
    @orders =
      current_user
        .orders
        .includes(:books, :user, :shipping_address)
        .page(params[:page] || 1)
        .per(params[:per_page] || 10)

    authorize @orders

    render json: {
             status: {
               code: 200,
               message: 'Fetched orders successfully',
             },
             orders: @orders.map { |order| OrderSerializer.new(order).as_json },
             pagination: {
               current_page: @orders.current_page,
               next_page: @orders.next_page,
               prev_page: @orders.prev_page,
               total_pages: @orders.total_pages,
               total_count: @orders.total_count,
             },
           },
           status: :ok
  end

  def get_all
    orders =
      Order
        .includes(:books, :user, :shipping_address)
        .page(params[:page] || 1)
        .per(params[:per_page] || 5)

    authorize Order, :get_all?

    render json: {
             status: {
               code: 200,
               message: 'Fetched all orders successfully',
             },
             orders: orders.map { |order| OrderSerializer.new(order).as_json },
             pagination: {
               current_page: orders.current_page,
               next_page: orders.next_page,
               prev_page: orders.prev_page,
               total_pages: orders.total_pages,
               total_count: orders.total_count,
             },
           },
           status: :ok
  end

  def show
    authorize @order

    render json: {
             status: {
               code: 200,
               message: 'Fetched order successfully',
             },
             order: OrderSerializer.new(@order).as_json,
           },
           status: :ok
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
    authorize @order
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
    params.require(:order).permit(:shipping_address_id, :payment_method, :note, :status)
  end
end
