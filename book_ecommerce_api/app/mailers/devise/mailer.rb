class Devise::Mailer < Devise.parent_mailer.constantize
  default template_path: 'devise/mailer'

  def confirmation_instructions(record, token, opts={})
    # Build frontend URL
    confirmation_url = "#{ENV['FRONTEND_URL']}/confirm?token=#{token}"
    opts[:subject] = "Confirm your account"
    @confirmation_url = confirmation_url
    super
  end
end
