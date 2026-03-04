# frozen_string_literal: true

# CRUD des mesures glycémiques (manuelles ou importées Dexcom).
# Chaque utilisateur ne voit que ses propres données.
class GlucoseReadingsController < ApplicationController
  before_action :set_glucose_reading, only: [:edit, :update, :destroy]

  # Liste les 100 dernières glycémies de l'utilisateur
  def index
    @glucose_readings = current_user.glucose_readings.recent.limit(100)
  end

  # Formulaire pour ajouter une nouvelle mesure (heure par défaut = maintenant)
  def new
    @glucose_reading = current_user.glucose_readings.build(recorded_at: Time.current)
  end

  # Enregistre une nouvelle glycémie
  def create
    @glucose_reading = current_user.glucose_readings.build(glucose_reading_params)
    if @glucose_reading.save
      redirect_to glucose_readings_path, notice: "Glycémie enregistrée."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # Affiche le formulaire de modification (vue partagée avec new)
  def edit
  end

  # Met à jour une glycémie existante
  def update
    if @glucose_reading.update(glucose_reading_params)
      redirect_to glucose_readings_path, notice: "Glycémie mise à jour."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # Supprime une glycémie
  def destroy
    @glucose_reading.destroy
    redirect_to glucose_readings_path, notice: "Glycémie supprimée."
  end

  private

  # Récupère la glycémie (vérifie qu'elle appartient à l'utilisateur connecté)
  def set_glucose_reading
    @glucose_reading = current_user.glucose_readings.find(params[:id])
  end

  # Paramètres autorisés (protection contre l'injection de champs)
  def glucose_reading_params
    params.require(:glucose_reading).permit(:value, :trend, :recorded_at, :source)
  end
end
