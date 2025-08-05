class ApplicationController < ActionController::API
  include Pundit::Authorization

  before_action :authenticate_user! # ✅ Kiểm tra token trước mọi action
  before_action :configure_permitted_parameters, if: :devise_controller? #Cho phép devise nhận thêm các attribute là name và avatar

  # Custom message for error input
  rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable_entity
  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
  rescue_from ActiveRecord::NotNullViolation, with: :render_not_null_violation

  # Custom message for pundit gem
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  # Custom message for devise JWT gem
  rescue_from JWT::ExpiredSignature, with: :token_expired
  rescue_from JWT::DecodeError, with: :invalid_token

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: %i[name avatar])
    devise_parameter_sanitizer.permit(:account_update, keys: %i[name avatar])
  end

  private

  #Handle custom error response of pundit
  def user_not_authorized(exception)
    policy_name = exception.policy.class.to_s.underscore

    render json: {
             error: 'Bạn không có quyền thực hiện hành động này.',
             detail: "#{policy_name}.#{exception.query} bị từ chối",
           },
           status: :forbidden # 403
  end

  #Handle custom error response of devise JWT
  def token_expired
    render json: { error: 'Token đã hết hạn' }, status: :unauthorized
  end

  def invalid_token
    render json: { error: 'Token không hợp lệ' }, status: :unauthorized
  end

  #Handle error input
  def render_unprocessable_entity(exception)
    render json: {
      status: 422,
      error: 'Unprocessable Entity',
      messages: exception.record.errors.full_messages
    }, status: :unprocessable_entity
  end

  def render_not_found(exception)
    render json: {
      status: 404,
      error: 'Not Found',
      message: exception.message
    }, status: :not_found
  end

  def render_not_null_violation(exception)
    render json: {
      status: 400,
      error: 'Bad Request',
      message: 'Missing required field: ' + parse_column_name(exception.message)
    }, status: :bad_request
  end

  def parse_column_name(message)
    match = message.match(/column "(.*?)"/)
    match ? match[1] : "unknown"
  end

end
