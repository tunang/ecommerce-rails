class Address < ApplicationRecord
  belongs_to :user


  validates :first_name,
            :last_name,
            :address_line_1,
            :city,
            :state,
            :postal_code,
            :country,
            presence: true
end
