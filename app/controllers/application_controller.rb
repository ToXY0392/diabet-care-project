class ApplicationController < ActionController::Base
  # L'application cible les navigateurs recents utilises par la maquette
  # interactive et par les notifications navigateur.
  allow_browser versions: :modern

  before_action :require_login

  helper_method :current_user, :logged_in?, :after_authentication_path

  private

  def current_user
    @current_user ||= User.find_by(id: session[:user_id]) if session[:user_id]
  end

  def logged_in?
    current_user.present?
  end

  # Redirige vers la racine : ecran de choix patient / soignant, puis connexion (pas /connexion direct).
  def require_login
    return if logged_in?

    redirect_to root_path, alert: "Connectez-vous pour acceder a DiabetCare."
  end

  def require_clinician
    return if current_user&.clinician?

    redirect_to after_authentication_path, alert: "Cet espace est reserve aux soignants."
  end

  def require_admin
    return if current_user&.admin?

    redirect_to after_authentication_path, alert: "Cet espace est reserve a l'administration."
  end

  # Destination apres connexion ou inscription : admin -> dashboard admin, sinon maquette dashboard.
  # Patient : mode smartphone (?phone=1) ; soignant : vue soignant (?view=soignant).
  def after_authentication_path(user = current_user)
    return admin_dashboard_path if user&.admin?

    return dashboard_path(phone: "1") if user&.patient?

    return dashboard_path(view: "soignant") if user&.clinician?

    dashboard_path
  end
end
