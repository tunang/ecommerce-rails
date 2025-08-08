# app/services/jwt_token_service.rb
class JwtTokenService
  REFRESH_EXP = 1.days

  def self.issue_refresh_token(user)
    refresh_token = SecureRandom.uuid
    $redis.setex("refresh_token:#{refresh_token}", REFRESH_EXP.to_i, user.id)
    return refresh_token
  end

  def self.user_from_refresh_token(refresh_token)
    user_id = $redis.get("refresh_token:#{refresh_token}")
    return nil unless user_id
    User.find_by(id: user_id)
  end

  def self.rotate_refresh_token(old_token, user)
    $redis.del("refresh_token:#{old_token}")
    issue_refresh_token(user)
  end

  def self.revoke_refresh_token(refresh_token)
    $redis.del("refresh_token:#{refresh_token}")
  end
end
