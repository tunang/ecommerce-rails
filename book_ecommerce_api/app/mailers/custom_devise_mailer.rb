# app/mailers/custom_devise_mailer.rb
class CustomDeviseMailer < Devise::Mailer
  include Devise::Controllers::UrlHelpers
  default template_path: 'devise/mailer'
  default from: ENV.fetch('DEFAULT_FROM_EMAIL', 'longprovip2508@gmail.com')

  def confirmation_instructions(record, token, opts = {})
    @resource = record
    @token = token
    @confirmation_url = "#{ENV['FRONTEND_URL']}/confirm?token=#{token}"

    mail(
      to: record.email,
      from: ENV.fetch('DEFAULT_FROM_EMAIL', 'longprovip2508@gmail.com'),
      subject: 'Confirmation instructions'
    )
  end
end
