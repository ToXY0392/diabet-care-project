# frozen_string_literal: true

# Service pour l'API Dexcom v3 - récupération des données du capteur G7.
# Documentation: https://developer.dexcom.com/docs/
# Configuration: .env (DEXCOM_CLIENT_ID, DEXCOM_CLIENT_SECRET, DEXCOM_SANDBOX)
class DexcomApiService
  SANDBOX_URL = "https://sandbox-api.dexcom.com"
  PRODUCTION_URL = "https://api.dexcom.com"

  def initialize(user)
    @user = user
  end

  # Génère l'URL de la page OAuth Dexcom - l'utilisateur y autorise l'app
  # Doc: https://developer.dexcom.com/docs/dexcom/authentication/
  def authorization_url(redirect_uri)
    base = sandbox? ? SANDBOX_URL : PRODUCTION_URL
    encoded_redirect = URI.encode_www_form_component(redirect_uri)
    "#{base}/v3/oauth2/login?client_id=#{client_id}&redirect_uri=#{encoded_redirect}&response_type=code&scope=offline_access"
  end

  # Échange le code OAuth (reçu en callback) contre access_token et refresh_token
  # Stocke les tokens sur l'utilisateur pour les appels API futurs
  def exchange_code_for_tokens(code, redirect_uri)
    base = sandbox? ? SANDBOX_URL : PRODUCTION_URL
    body = URI.encode_www_form(
      client_id: client_id,
      client_secret: client_secret,
      code: code,
      redirect_uri: redirect_uri,
      grant_type: "authorization_code"
    )
    response = HTTParty.post("#{base}/v3/oauth2/token",
      body: body,
      headers: { "Content-Type" => "application/x-www-form-urlencoded" })

    return nil unless response.success?

    data = response.parsed_response
    @user.update!(
      dexcom_access_token: data["access_token"],
      dexcom_refresh_token: data["refresh_token"],
      dexcom_token_expires_at: Time.current + data["expires_in"].seconds
    )
    true
  end

  # Récupère les EGV (Estimated Glucose Values) depuis l'API Dexcom
  # Retourne un tableau de { value, trend, recorded_at }
  def fetch_egvs(start_time: nil, end_time: nil)
    return [] unless @user.dexcom_access_token.present?

    base = sandbox? ? SANDBOX_URL : PRODUCTION_URL
    start_time ||= 24.hours.ago
    end_time ||= Time.current

    response = HTTParty.get("#{base}/v3/users/self/egvs",
      query: { startDate: start_time.iso8601, endDate: end_time.iso8601 },
      headers: { "Authorization" => "Bearer #{@user.dexcom_access_token}" })

    return [] unless response.success?

    response.parsed_response["records"]&.map do |r|
      {
        value: r["value"],
        trend: r["trend"],
        recorded_at: Time.parse(r["systemTime"])
      }
    end || []
  end

  # Importe les données Dexcom en base : crée des glucose_readings
  # Évite les doublons (même recorded_at + source dexcom)
  # Enregistre le log de sync pour traçabilité
  def sync_readings!
    records = fetch_egvs
    count = 0
    records.each do |r|
      next if @user.glucose_readings.exists?(recorded_at: r[:recorded_at], source: "dexcom")

      @user.glucose_readings.create!(
        value: r[:value],
        trend: r[:trend],
        recorded_at: r[:recorded_at],
        source: "dexcom"
      )
      count += 1
    end
    @user.dexcom_sync_logs.create!(last_sync_at: Time.current, records_imported: count)
    count
  end

  private

  def client_id
    ENV["DEXCOM_CLIENT_ID"]
  end

  def client_secret
    ENV["DEXCOM_CLIENT_SECRET"]
  end

  # Sandbox = données de test ; Production = vraies données Dexcom
  def sandbox?
    Rails.env.development? || ENV["DEXCOM_SANDBOX"] == "true"
  end
end
