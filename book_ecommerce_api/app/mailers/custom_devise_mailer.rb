# app/mailers/custom_devise_mailer.rb
class CustomDeviseMailer < Devise::Mailer
  include Devise::Controllers::UrlHelpers
  default template_path: 'devise/mailer'
  default from: ENV.fetch('DEFAULT_FROM_EMAIL', 'longprovip2508@gmail.com')

  def confirmation_instructions(record, token, opts = {})
    @resource = record
    @token = token
    # @confirmation_url = "#{ENV['FRONTEND_URL']}/confirm?token=#{token}"
    @confirmation_url = "https://8dacc2d677cb.ngrok-free.app/confirm?token=#{token}"

    mail(
      to: record.email,
      subject: 'Confirmation instructions',
      from: ENV.fetch('DEFAULT_FROM_EMAIL', 'longprovip2508@gmail.com')
    )
  end

  def reset_password_instructions(record, token, opts = {})
    @resource = record
    @token = token
    @reset_url = "https://8dacc2d677cb.ngrok-free.app/reset-password?reset_password_token=#{token}"

    mail(
      to: record.email,
      subject: opts[:subject] || 'Reset your password',
      from: ENV.fetch('DEFAULT_FROM_EMAIL', 'longprovip2508@gmail.com')
    )
  end
end
