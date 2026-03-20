class UsersController < ApplicationController
  # Cree uniquement des comptes patient lors du parcours d'inscription public.
  skip_before_action :require_login, only: %i[begin_patient_signup new create]
  before_action :require_patient_signup_context, only: %i[new create]

  # Point d'entree depuis la page marketing : fixe le contexte patient puis ouvre le formulaire d'inscription.
  def begin_patient_signup
    session[:login_role] = "patient"
    redirect_to new_user_path
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)

    if @user.save
      session[:user_id] = @user.id
      # Le contexte de choix de profil n'est plus necessaire une fois le compte cree.
      session.delete(:login_role)
      redirect_to after_authentication_path(@user), notice: "Compte cree avec succes."
    else
      render :new, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end

  # L'inscription ne concerne que les patients : doit suivre « Je suis patient » ou /inscription/patient.
  def require_patient_signup_context
    return if session[:login_role] == "patient"

    redirect_to root_path, alert: "L'inscription concerne uniquement les comptes patients. Choisissez d'abord « Je suis patient » ou utilisez le lien d'inscription depuis la page d'accueil."
  end
end
