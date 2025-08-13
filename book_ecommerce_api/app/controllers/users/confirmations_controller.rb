class Users::ConfirmationsController < Devise::ConfirmationsController
  include RackSessionsFix

  def confirm
    token = params[:token]
    user = User.confirm_by_token(token)

    if user.errors.empty?
      render json: { message: "Account confirmed successfully" }, status: :ok
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end
end
