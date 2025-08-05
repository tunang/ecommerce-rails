class Book < ApplicationRecord
  has_many :book_authors, dependent: :destroy
  has_many :authors, through: :book_authors
  has_many :book_categories, dependent: :destroy
  has_many :categories, through: :book_categories
  has_many :order_items, dependent: :destroy
  has_many :cart_items, dependent: :destroy

  has_one_attached :cover_image
  has_many_attached :sample_pages

  validates :title, presence: true
  validates :price, presence: true, numericality: { greater_than: 0 }
  validates :stock_quantity,
            presence: true,
            numericality: {
              greater_than_or_equal_to: 0,
            }
end
