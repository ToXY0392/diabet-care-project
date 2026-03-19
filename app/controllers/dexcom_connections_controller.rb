class DexcomConnectionsController < ApplicationController
  def connect
    unless Dexcom::Config.configured?
      redirect_to dashboard_path, alert: "Configuration Dexcom manquante dans les variables d'environnement."
      return
    end

    state = SecureRandom.hex(24)
    session[:dexcom_oauth_state] = state

    redirect_to Dexcom::Config.authorization_url(state: state), allow_other_host: true
  end

  def callback
    if params[:error].present?
      redirect_to dashboard_path, alert: "Connexion Dexcom refusee: #{params[:error]}."
      return
    end

    if session.delete(:dexcom_oauth_state) != params[:state]
      redirect_to dashboard_path, alert: "La verification Dexcom a echoue."
      return
    end

    response = Dexcom::Client.new.exchange_code(code: params[:code])
    connection = current_user.dexcom_connection || current_user.build_dexcom_connection

    connection.update!(
      access_token: response.fetch("access_token"),
      refresh_token: response.fetch("refresh_token"),
      expires_at: response.fetch("expires_in").to_i.seconds.from_now,
      environment: Dexcom::Config.environment,
      revoked_at: nil
    )

    imported_count = Dexcom::SyncReadings.call(user: current_user)
    redirect_to dashboard_path, notice: "Connexion Dexcom reussie. #{imported_count} glycemies synchronisees."
  rescue Dexcom::Error, KeyError => error
    redirect_to dashboard_path, alert: "Dexcom: #{error.message}"
  end

  def sync
    imported_count = Dexcom::SyncReadings.call(user: current_user)
    redirect_to dashboard_path, notice: "Synchronisation Dexcom terminee: #{imported_count} glycemies importees."
  rescue Dexcom::Error => error
    redirect_to dashboard_path, alert: error.message
  end

  def destroy
    current_user.dexcom_connection&.destroy
    redirect_to dashboard_path, notice: "Connexion Dexcom supprimee."
  end
end
