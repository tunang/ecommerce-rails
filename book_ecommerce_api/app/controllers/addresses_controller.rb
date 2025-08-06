class AddressesController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show] # ✅ Kiểm tra token trước mọi action
  before_action :set_address, only: %i[show update destroy]

  def index
    @addresses = current_user.addresses
    authorize Address
    render json: @addresses
  end

  def show
    authorize @address
    render json: @address
  end

  def create
    @address = current_user.addresses.build(address_params)
    authorize @address

    if @address.save
      render json: AddressSerializer.new(@address).as_json, status: :created
    else
      render json: {
               status: 422,
               errors: @address.errors.full_messages,
             },
             status: :unprocessable_entity
    end
  end

  def update
    authorize @address
    if @address.update(address_params)
      render json: @address
    else
      render json: {
               errors: @address.errors.full_messages,
             },
             status: :unprocessable_entity
    end
  end

  def destroy
    authorize @address
    @address.destroy
    head :no_content
  end

  private

  def set_address
    @address = Address.find(params[:id])
  end

  def address_params
    params
      .require(:address)
      .permit(
        :first_name,
        :last_name,
        :address_line_1,
        :address_line_2,
        :city,
        :state,
        :postal_code,
        :country,
        :phone,
        :is_default,
      )
  end
end
