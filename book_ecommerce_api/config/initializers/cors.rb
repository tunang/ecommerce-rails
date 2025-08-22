Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*' # Or specifically your ngrok URLs
    
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: false, # Important: set to false for wildcard origins
      expose: ['Content-Type', 'Content-Disposition']
  end

  # Specific rule for Active Storage
  allow do
    origins '*'
    
    resource '/rails/storage/*',
      headers: :any,
      methods: [:get, :head, :options],
      credentials: false
  end
end