class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  has_many :cart_items, dependent: :destroy
  has_many :cart_books, through: :cart_items, source: :book
  has_many :addresses, dependent: :destroy
  has_many :orders, dependent: :destroy
  has_many :order_books, through: :orders, source: :book

  enum :role, { user: 'user', admin: 'admin' }

  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :confirmable,
         :validatable,
         :jwt_authenticatable,
         jwt_revocation_strategy: self

  # Mặc định mỗi user là 'user' nếu không khai báo
  after_initialize { self.role ||= 'user' }
end
