class SendVerificationEmailJob < ApplicationJob
  queue_as :default

  def perform(*args)
    CustomDeviseMailer.confirmation_instructions().deliver_later
  end
end
