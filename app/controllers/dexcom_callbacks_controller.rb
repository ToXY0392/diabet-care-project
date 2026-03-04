# frozen_string_literal: true

# Callback OAuth Dexcom : après connexion sur dexcom.com, Dexcom redirige ici
# avec un code d'autorisation. On l'échange contre des tokens (access + refresh).
class DexcomCallbacksController < ApplicationController
  def callback
    service = DexcomApiService.new(current_user)
    if service.exchange_code_for_tokens(params[:code], dexcom_callback_url)
      redirect_to root_path, notice: "Dexcom connecté !"
    else
      redirect_to target_path, alert: "Échec de la connexion Dexcom."
    end
  end
end
