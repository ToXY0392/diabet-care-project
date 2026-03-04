# frozen_string_literal: true

# Objectifs glycémiques : plage cible (min/max en mg/dL).
# Utilisé pour calculer le "temps en cible" dans les rapports.
# Un utilisateur n'a qu'un seul objectif (relation has_one).
class TargetsController < ApplicationController
  before_action :set_target, only: [:show, :edit, :update]

  # Si pas d'objectif défini, redirige vers le formulaire
  def show
    redirect_to edit_target_path unless @target
  end

  # Formulaire : crée un objectif fictif avec valeurs par défaut (70-180) si inexistant
  def edit
    @target ||= current_user.build_target(min_glucose: 70, max_glucose: 180)
  end

  # Sauvegarde ou met à jour l'objectif
  def update
    @target ||= current_user.build_target
    if @target.update(target_params)
      redirect_to target_path, notice: "Objectifs mis à jour."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  private

  def set_target
    @target = current_user.target
  end

  def target_params
    params.require(:target).permit(:min_glucose, :max_glucose)
  end
end
