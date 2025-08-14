class PaymentsController < ApplicationController
  # Create order and generate checkout session
  def create_stripe_checkout_session
    begin
      # Create order in database
      order =
        Order.create!(
          user: current_user,
          customer_email: params[:customer_email] || current_user&.email,
          shipping_address: params[:shipping_address],
          status: :pending,
        )

      # Create order items
      line_items = []
      params[:items].each do |item|
        product = Product.find(item[:product_id])
        order.order_items.create!(
          product: product,
          quantity: item[:quantity],
          price: product.price,
        )

        # Add to Stripe line items
        line_items << {
          price: product.stripe_price_id,
          quantity: item[:quantity],
        }
      end

      # Create Stripe Checkout Session
      checkout_session =
        Stripe::Checkout::Session.create(
          {
            payment_method_types: ['card'],
            line_items: line_items,
            mode: 'payment',
            success_url:
              "#{params[:success_url]}?session_id={CHECKOUT_SESSION_ID}&order_id=#{order.id}",
            cancel_url: "#{params[:cancel_url]}?order_id=#{order.id}",
            customer_email: order.customer_email,
            metadata: {
              order_id: order.id,
              user_id: current_user&.id,
            },
            # Optional: Collect shipping address
            shipping_address_collection: {
              allowed_countries: %w[US CA GB AU], # Add your allowed countries
            },
            # Optional: Add tax calculation
            automatic_tax: {
              enabled: false, # Set to true if you want automatic tax calculation
            },
          },
        )

      # Save checkout session ID to order
      order.update!(stripe_checkout_session_id: checkout_session.id)

      render json: {
               checkout_url: checkout_session.url,
               session_id: checkout_session.id,
               order: order_response(order),
             },
             status: :created
    rescue Stripe::StripeError => e
      render json: { error: e.message }, status: :unprocessable_entity
    rescue => e
      render json: { error: e.message }, status: :unprocessable_entity
    end
  end

  # Verify checkout session and update order
  def verify_stripe_checkout_session
    begin
      session = Stripe::Checkout::Session.retrieve(params[:session_id])
      order = Order.find_by(id: session.metadata['order_id'])

      if session.payment_status == 'paid' && order
        order.update!(
          status: :paid,
          stripe_payment_intent_id: session.payment_intent,
        )

        render json: {
                 status: 'success',
                 message: 'Payment successful',
                 order: order_response(order),
                 payment_status: session.payment_status,
               },
               status: :ok
      else
        render json: {
                 status: 'failed',
                 message: 'Payment not completed',
                 payment_status: session.payment_status,
               },
               status: :unprocessable_entity
      end
    rescue Stripe::StripeError => e
      render json: { error: e.message }, status: :unprocessable_entity
    end
  end
end
