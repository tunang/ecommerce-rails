# app/controllers/refresh_tokens_controller.rb
class RefreshTokensController < ApplicationController
  # Bỏ before_action :authenticate_user!, vì người dùng chưa có access token
  include RackSessionsFix

  def create
    old_token = params[:refresh_token]

    user = JwtTokenService.user_from_refresh_token(old_token)
    unless user
      return render json: { error: 'Invalid or expired refresh token' }, status: :unauthorized
    end

    # Đăng nhập lại để Devise JWT cấp access token mới
    sign_in(user)

    # Tạo refresh token mới và xóa cái cũ
    new_refresh_token = JwtTokenService.rotate_refresh_token(old_token, user)

    render json: {
      status: { code: 200, message: 'Access token refreshed successfully' },
      access_token: request.env['warden-jwt_auth.token'],
      refresh_token: new_refresh_token
    }, status: :ok
  end
end
