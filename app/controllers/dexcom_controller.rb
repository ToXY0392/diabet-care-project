# frozen_string_literal: true

# Connexion et synchronisation Dexcom.
# OAuth 2.0 : l'utilisateur autorise DiabetCare à accéder à ses données Dexcom G7.
class DexcomController < ApplicationController
  # Redirige vers la page de login Dexcom (OAuth) - l'utilisateur se connecte sur dexcom.com
  def connect
    redirect_uri = dexcom_callback_url
    url = DexcomApiService.new(current_user).authorization_url(redirect_uri)
    redirect_to url, allow_other_host: true
  end

  # Importe les glycémies depuis l'API Dexcom et les enregistre en base
  def sync
    count = DexcomApiService.new(current_user).sync_readings!
    redirect_to glucose_readings_path, notice: "#{count} mesure(s) importée(s) depuis Dexcom."
  end
end
