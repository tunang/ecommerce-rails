# app/serializers/cart_item_serializer.rb
class CartItemSerializer < ActiveModel::Serializer
  attributes :id, :quantity
  belongs_to :book, serializer: BookSerializer
end
