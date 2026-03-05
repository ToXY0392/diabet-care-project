# frozen_string_literal: true

# Connexion et synchronisation Dexcom.
# OAuth 2.0 : l'utilisateur autorise DiabetCare à accéder à ses données Dexcom G7.
class DexcomController < ApplicationController
  # Redirige vers la page de login Dexcom (OAuth) - l'utilisateur se connecte sur dexcom.com
  # Utilise DEXCOM_REDIRECT_URI si défini (doit correspondre exactement à l'URI enregistrée sur developer.dexcom.com)
  def connect
    redirect_uri = dexcom_redirect_uri
    state = SecureRandom.hex(16)
    session[:dexcom_oauth_state] = state
    url = DexcomApiService.new(current_user).authorization_url(redirect_uri, state: state)
    redirect_to url, allow_other_host: true
  end

  # Page de diagnostic (development uniquement) : vérifier la config OAuth
  def check
    unless Rails.env.development?
      redirect_to dashboard_path, alert: "Diagnostic non disponible."
      return
    end

    redirect_uri = dexcom_redirect_uri
    cid = ENV["DEXCOM_CLIENT_ID"]&.strip
    sandbox_mode = Rails.env.development? || ENV["DEXCOM_SANDBOX"] == "true"
    @diagnostic = {
      redirect_uri: redirect_uri,
      redirect_uri_source: ENV["DEXCOM_REDIRECT_URI"].present? ? "DEXCOM_REDIRECT_URI (.env)" : "détecté automatiquement",
      client_id_set: cid.present?,
      client_id_length: cid.to_s.length,
      client_id_preview: cid.present? ? "#{cid[0, 4]}...#{cid[-4..]}" : nil,
      client_secret_set: ENV["DEXCOM_CLIENT_SECRET"]&.strip.present?,
      sandbox: sandbox_mode,
      base_url: sandbox_mode ? "https://sandbox-api.dexcom.com" : "https://api.dexcom.com"
    }
  end

  # Importe les glycémies depuis l'API Dexcom et les enregistre en base
  def sync
    count = DexcomApiService.new(current_user).sync_readings!
    redirect_to glucose_readings_path, notice: "#{count} mesure(s) importée(s) depuis Dexcom."
  end
end
