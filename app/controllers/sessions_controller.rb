class SessionsController < ApplicationController
  # Gere l'ouverture et la fermeture de session pour patient, soignant et admin.
  # La session `login_role` doit etre positionnee par PagesController#choose_profile avant l'affichage du formulaire.
  skip_before_action :require_login, only: %i[new create]

  def new
    redirect_to after_authentication_path if logged_in?
    # Evite d'afficher /connexion sans etre passe par l'ecran de choix du profil
    unless session[:login_role].present?
      redirect_to root_path, alert: "Indiquez d'abord si vous etes patient, soignant ou administration."
      return
    end
  end

  def create
    unless session[:login_role].present?
      redirect_to root_path, alert: "Indiquez d'abord si vous etes patient, soignant ou administration."
      return
    end

    user = User.find_by(email: params[:email].to_s.downcase)

    if user&.authenticate(params[:password])
      expected = session[:login_role]
      # Le compte doit correspondre au profil choisi (patient vs soignant vs admin)
      if user.role != expected
        flash.now[:alert] = profile_mismatch_message(expected)
        render :new, status: :unprocessable_entity
        return
      end

      session[:user_id] = user.id
      session.delete(:login_role)
      redirect_to after_authentication_path(user), notice: "Connexion reussie."
    else
      flash.now[:alert] = "Email ou mot de passe invalide."
      render :new, status: :unprocessable_entity
    end
  end

  def destroy
    reset_session
    redirect_to root_path, notice: "Deconnexion reussie."
  end

  private

  # Messages utilisateur si l'identifiant correspond a un autre type de compte que celui choisi a l'accueil.
  def profile_mismatch_message(expected)
    case expected
    when "patient" then "Ce compte n'est pas un compte patient. Verifiez ou choisissez « Je suis soignant »."
    when "clinician" then "Ce compte n'est pas un compte soignant. Verifiez ou choisissez « Je suis patient »."
    when "admin" then "Ce compte n'est pas un compte administration."
    else "Profil de compte incompatible avec votre selection."
    end
  end
end
