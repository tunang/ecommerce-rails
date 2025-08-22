Rails.application.config.to_prepare do
  # Fix CORS for Active Storage Blobs Controller
  ActiveStorage::Blobs::ProxyController.class_eval do
    before_action :set_cors_headers

    private

    def set_cors_headers
      response.headers['Access-Control-Allow-Origin'] = '*'
      response.headers['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS'
      response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
      response.headers['Cross-Origin-Resource-Policy'] = 'cross-origin'
      response.headers['Cross-Origin-Embedder-Policy'] = 'unsafe-none'
    end
  end

  # Fix CORS for Active Storage Base Controller
  ActiveStorage::BaseController.class_eval do
    before_action :set_cors_headers

    private

    def set_cors_headers
      response.headers['Access-Control-Allow-Origin'] = '*'
      response.headers['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS'
      response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
      response.headers['Cross-Origin-Resource-Policy'] = 'cross-origin'
      response.headers['Cross-Origin-Embedder-Policy'] = 'unsafe-none'
    end
  end
end