# frozen_string_literal: true

# Création de compte (inscription).
# Accessible sans connexion.
class RegistrationsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:new, :create]

  # Formulaire d'inscription
  def new
    @user = User.new
  end

  # Crée le compte et connecte automatiquement l'utilisateur
  def create
    @user = User.new(user_params)
    if @user.save
      session[:user_id] = @user.id
      redirect_to root_path, notice: "Compte créé avec succès !"
    else
      render :new, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation)
  end
end
