# Flux « mot de passe oublie » : demande par email, lien signe (Rails signed_id),
# formulaire de nouveau mot de passe. Aucune session requise ; le message de succes
# est identique que l'email existe ou non (evite l'enumeration de comptes).
class PasswordResetsController < ApplicationController
  skip_before_action :require_login
  before_action :load_user_from_token, only: %i[edit update]

  # Formulaire de saisie de l'adresse email.
  def new
  end

  # Envoie l'email avec le lien si un utilisateur correspond ; sinon ne revele rien.
  def create
    if (user = User.find_by(email: params[:email].to_s.downcase))
      UserMailer.password_reset(user).deliver_now
    end

    redirect_to root_path, notice: "Si un compte existe pour cet email, un lien de reinitialisation vient d'etre envoye."
  end

  # Arrivee depuis le lien dans l'email (token dans l'URL).
  def edit
  end

  # Met a jour le mot de passe une fois le token valide.
  def update
    if @user.update(password_params)
      redirect_to root_path, notice: "Votre mot de passe a ete mis a jour. Vous pouvez vous connecter."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  private

  # Charge l'utilisateur a partir du jeton signe ; sinon redirection vers la demande initiale.
  def load_user_from_token
    @user = User.find_by_password_reset_token(params[:token])
    return if @user

    redirect_to new_password_reset_path, alert: "Le lien de reinitialisation est invalide ou a expire."
  end

  def password_params
    params.require(:user).permit(:password, :password_confirmation)
  end
end
