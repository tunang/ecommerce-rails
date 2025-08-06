class CartsController < ApplicationController
  before_action :authenticate_user!, except: [:show] # ✅ Kiểm tra token trước mọi action
  before_action :authenticate_user!

  def show
  authorize :cart, :show?
  cart_items = current_user.cart_items.includes(:book)

  render json: {
           status: {
             code: 200,
             message: 'Cart loaded successfully',
           },
           data: cart_items.map do |item|
             {
               quantity: item.quantity,
               book: BookSerializer.new(item.book).as_json
             }
           end
         },
         status: :ok
  end

  def add_item
    authorize :cart, :add_item?
    book = Book.find(params[:book_id])
    item = current_user.cart_items.find_or_initialize_by(book:)
    binding.pry
    item.quantity += params[:quantity].to_i
    if item.save
      render json: {
        status: {
          code: 200,
          message: "Item added to cart"
        }
        item: {
          quantity: item.quantity,
          book: BookSerializer.new(item.book).as_json
        }
      }
    else
      render json: { error: item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def remove_item
    authorize :cart, :remove_item?
    item = current_user.cart_items.find_by(book_id: params[:id])

    if item
      item.destroy
      render json: {
        status: {
          code: 200,
          message: "Item removed from cart"
        }
        item: {
          quantity: item.quantity,
          book: BookSerializer.new(item.book).as_json
        }
      }
    else
      render json: { error: 'Item not found' }, status: :not_found
    end
  end

  def clear
    authorize :cart, :clear?
    current_user.cart_items.destroy_all
    render json: { message: 'Cart cleared.' }, status: :ok
  end
end
