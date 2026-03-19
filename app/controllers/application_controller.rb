class ApplicationController < ActionController::Base
  # L'application cible les navigateurs recents utilises par la maquette
  # interactive et par les notifications navigateur.
  allow_browser versions: :modern

  before_action :require_login

  helper_method :current_user, :logged_in?

  private

  def current_user
    @current_user ||= User.find_by(id: session[:user_id]) if session[:user_id]
  end

  def logged_in?
    current_user.present?
  end

  def require_login
    return if logged_in?

    redirect_to new_session_path, alert: "Connectez-vous pour acceder a DiabetCare."
  end

  def require_clinician
    return if current_user&.clinician?

    redirect_to dashboard_path, alert: "Cet espace est reserve aux soignants."
  end
end
