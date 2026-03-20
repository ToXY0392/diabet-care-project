class PagesController < ApplicationController
  # Pages publiques : choix de profil avant connexion, presentation produit, maquette dashboard.
  skip_before_action :require_login, only: %i[role_select choose_profile reset_login_role home]

  # Premier ecran : l'utilisateur indique s'il accede en tant que patient, soignant ou administration.
  def role_select
  end

  # Enregistre le profil attendu en session puis envoie vers la page de connexion (/connexion).
  def choose_profile
    role = params[:role].to_s
    unless User::ROLES.include?(role)
      redirect_to root_path, alert: "Profil invalide."
      return
    end

    session[:login_role] = role
    redirect_to login_path
  end

  # Annule le choix de profil (lien depuis l'ecran de connexion) pour revenir au selecteur.
  def reset_login_role
    session.delete(:login_role)
    redirect_to root_path
  end

  # Page marketing publique (presentation du produit sans connexion).
  def home
    redirect_to after_authentication_path if logged_in?
  end

  def dashboard
    return redirect_to admin_dashboard_path if current_user.admin?

    # Le dashboard affiche la maquette HTML commune, mais avec des donnees
    # patient ou soignant injectees dynamiquement depuis Rails.
    render html: Dashboard::MockupRenderer.call(user: current_user, window: params[:window], csrf_token: form_authenticity_token).html_safe, layout: false
  end
end
