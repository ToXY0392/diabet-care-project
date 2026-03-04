# frozen_string_literal: true

# CRUD des repas : glucides (g) et bolus insuline (U) par repas.
# Permet de suivre l'alimentation et les doses.
class MealsController < ApplicationController
  before_action :set_meal, only: [:edit, :update, :destroy]

  # Liste les 50 derniers repas
  def index
    @meals = current_user.meals.recent.limit(50)
  end

  # Formulaire nouveau repas (heure par défaut = maintenant)
  def new
    @meal = current_user.meals.build(recorded_at: Time.current)
  end

  # Enregistre un nouveau repas
  def create
    @meal = current_user.meals.build(meal_params)
    if @meal.save
      redirect_to meals_path, notice: "Repas enregistré."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @meal.update(meal_params)
      redirect_to meals_path, notice: "Repas mis à jour."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @meal.destroy
    redirect_to meals_path, notice: "Repas supprimé."
  end

  private

  def set_meal
    @meal = current_user.meals.find(params[:id])
  end

  # Retourne la dernière glycémie Dexcom (JSON) - pour le bouton "Utiliser capteur"
  def latest_glucose
    unless current_user.dexcom_access_token.present?
      return render json: { error: "Dexcom non connecté. Connectez-le dans le tableau de bord." }, status: :unprocessable_entity
    end

    records = DexcomApiService.new(current_user).fetch_egvs(
      start_time: 15.minutes.ago,
      end_time: Time.current
    )
    latest = records.last
    if latest
      render json: { value: latest[:value], trend: latest[:trend], recorded_at: latest[:recorded_at].iso8601 }
    else
      render json: { error: "Aucune donnée Dexcom sur les 15 dernières minutes. Synchronisez Dexcom." }, status: :not_found
    end
  end

  def meal_params
    params.require(:meal).permit(:carbs, :bolus, :recorded_at, :meal_type, :notes, :glucose)
  end
end
