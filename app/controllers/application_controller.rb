# Contrôleur de base : toutes les pages héritent de celui-ci.
# Gère l'authentification, la session utilisateur et les méthodes partagées.
class ApplicationController < ActionController::Base
  allow_browser versions: :modern
  stale_when_importmap_changes

  # Exiger une connexion sur toutes les actions (sauf exceptions)
  before_action :authenticate_user!

  # Rendre ces méthodes utilisables dans les vues
  helper_method :current_user, :logged_in?

  private

  # Retourne l'utilisateur connecté (mis en cache pendant la requête)
  def current_user
    @current_user ||= User.find_by(id: session[:user_id]) if session[:user_id]
  end

  # Vérifie si un utilisateur est connecté
  def logged_in?
    current_user.present?
  end

  # Redirige vers la page de login si non connecté (sauf pages publiques)
  def authenticate_user!
    return if logged_in?
    return if auth_skip_path?

    redirect_to login_path, alert: "Veuillez vous connecter."
  end

  # Pages accessibles sans connexion : home, privacy, login, signup
  def auth_skip_path?
    return true if controller_name == "pages" && action_name.in?(%w[home privacy])
    controller_name.in?(%w[sessions registrations]) && action_name.in?(%w[new create])
  end

  # URI de callback OAuth Dexcom — doit correspondre exactement à celle enregistrée sur developer.dexcom.com
  def dexcom_redirect_uri
    ENV["DEXCOM_REDIRECT_URI"].presence || dexcom_callback_url
  end
end
