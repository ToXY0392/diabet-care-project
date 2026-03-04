# frozen_string_literal: true

# Connexion / déconnexion des utilisateurs.
# Les actions new et create n'exigent pas d'être connecté.
class SessionsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:new, :create]

  # Affiche le formulaire de connexion
  def new
    @user = User.new
  end

  # Traite la soumission du formulaire : vérifie identifiants et crée la session
  def create
    user = User.find_by(email: params[:email])
    if user&.authenticate(params[:password])
      session[:user_id] = user.id
      redirect_to root_path, notice: "Bienvenue #{user.email} !"
    else
      flash.now[:alert] = "Email ou mot de passe incorrect."
      render :new, status: :unprocessable_entity
    end
  end

  # Déconnexion : supprime l'ID utilisateur de la session
  def destroy
    session.delete(:user_id)
    redirect_to root_path, notice: "Vous êtes déconnecté."
  end
end
