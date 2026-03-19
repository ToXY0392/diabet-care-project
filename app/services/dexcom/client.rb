require "json"
require "net/http"

module Dexcom
  class Error < StandardError; end
  class ConfigurationError < Error; end
  class ApiError < Error; end

  class Client
    def initialize(connection: nil, access_token: nil)
      @connection = connection
      @access_token = access_token || connection&.access_token
    end

    def exchange_code(code:)
      request_form(
        path: "/v3/oauth2/token",
        params: {
          client_id: Config.client_id,
          client_secret: Config.client_secret,
          code: code,
          grant_type: "authorization_code",
          redirect_uri: Config.redirect_uri
        }
      )
    end

    def refresh_tokens!(connection)
      response = request_form(
        path: "/v3/oauth2/token",
        params: {
          client_id: Config.client_id,
          client_secret: Config.client_secret,
          refresh_token: connection.refresh_token,
          grant_type: "refresh_token"
        }
      )

      connection.update!(
        access_token: response.fetch("access_token"),
        refresh_token: response.fetch("refresh_token"),
        expires_at: response.fetch("expires_in").to_i.seconds.from_now
      )

      @access_token = connection.access_token
      response
    end

    def egvs(start_time:, end_time:)
      request_json(
        path: "/v3/users/self/egvs",
        query: {
          startDate: iso8601_time(start_time),
          endDate: iso8601_time(end_time)
        }
      )
    end

    private

    def request_form(path:, params:)
      uri = URI.join(Config.base_url, path)
      request = Net::HTTP::Post.new(uri)
      request["Content-Type"] = "application/x-www-form-urlencoded"
      request.set_form_data(params)
      perform_request(uri, request)
    end

    def request_json(path:, query:)
      uri = URI.join(Config.base_url, path)
      uri.query = URI.encode_www_form(query)
      request = Net::HTTP::Get.new(uri)
      request["Authorization"] = "Bearer #{@access_token}"
      request["Accept"] = "application/json"
      perform_request(uri, request)
    end

    def perform_request(uri, request)
      response = Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == "https") do |http|
        http.request(request)
      end

      parsed_body = response.body.present? ? JSON.parse(response.body) : {}
      return parsed_body if response.is_a?(Net::HTTPSuccess)

      raise ApiError, parsed_body.presence || "Dexcom API error (#{response.code})."
    rescue JSON::ParserError
      raise ApiError, "Dexcom response parsing failed."
    end

    def iso8601_time(time)
      time.utc.strftime("%Y-%m-%dT%H:%M:%S")
    end
  end
end
