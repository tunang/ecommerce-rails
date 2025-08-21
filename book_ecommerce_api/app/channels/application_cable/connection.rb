# app/channels/application_cable/connection.rb
module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

    def find_verified_user
      # If you use Devise + JWT
      token = request.params[:token] # token passed in ws://.../cable?token=xxx

      if token.present?
        begin
          # Decode JWT
          payload = Warden::JWTAuth::TokenDecoder.new.call(token)
          user = User.find(payload["sub"])

          return user if user
        rescue => e
          Rails.logger.error("JWT Auth error: #{e.message}")
        end
      end

      reject_unauthorized_connection
    end
  end
end
