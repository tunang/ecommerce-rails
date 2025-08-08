class UsersController < ApplicationController
  before_action :authenticate_user!

  def me
    render json: {
      status: {
        code: 200,
        message: 'Get current user successfully.'
      },
      user: UserSerializer.new(current_user).serializable_hash[:data][:attributes]
    }, status: :ok
  end
end
