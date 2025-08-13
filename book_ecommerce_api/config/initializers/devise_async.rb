# config/initializers/devise_async.rb
Rails.application.config.to_prepare do
  Devise::Mailer.class_eval do
    # nothing here now — patch is in the model
  end

  # Patch Devise::Models::Authenticatable
  Devise::Models::Authenticatable.module_eval do
    def send_devise_notification(notification, *args)
      devise_mailer.send(notification, self, *args).deliver_later(queue: 'mailers')
    end
  end
end
