# frozen_string_literal: true

# Callback OAuth Dexcom : après connexion sur dexcom.com, Dexcom redirige ici
# avec un code d'autorisation. On l'échange contre des tokens (access + refresh).
class DexcomCallbacksController < ApplicationController
  def callback
    # Vérification CSRF : le state doit correspondre à celui stocké en session
    stored_state = session.delete(:dexcom_oauth_state)
    if stored_state.blank? || params[:state] != stored_state
      redirect_to dashboard_path, alert: "Échec de la connexion Dexcom (vérification CSRF)."
      return
    end

    service = DexcomApiService.new(current_user)
    if service.exchange_code_for_tokens(params[:code], dexcom_redirect_uri)
      redirect_to root_path, notice: "Dexcom connecté !"
    else
      redirect_to dashboard_path, alert: "Échec de la connexion Dexcom."
    end
  end
end
