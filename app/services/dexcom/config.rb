module Dexcom
  module Config
    module_function

    def client_id
      ENV["DEXCOM_CLIENT_ID"]
    end

    def client_secret
      ENV["DEXCOM_CLIENT_SECRET"]
    end

    def redirect_uri
      ENV["DEXCOM_REDIRECT_URI"]
    end

    def environment
      ENV.fetch("DEXCOM_ENV", "sandbox")
    end

    def base_url
      environment == "production" ? "https://api.dexcom.com" : "https://sandbox-api.dexcom.com"
    end

    def configured?
      [client_id, client_secret, redirect_uri].all?(&:present?)
    end

    def authorization_url(state:)
      raise ConfigurationError, "Configuration Dexcom incomplete." unless configured?

      params = {
        client_id: client_id,
        redirect_uri: redirect_uri,
        response_type: "code",
        scope: "offline_access",
        state: state
      }

      "#{base_url}/v3/oauth2/login?#{URI.encode_www_form(params)}"
    end
  end
end
