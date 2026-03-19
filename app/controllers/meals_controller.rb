class MealsController < ApplicationController
  # Permet au patient de contextualiser ses mesures avec ses repas et glucides.
  before_action :set_meal, only: %i[show edit update destroy]

  def index
    @meals = current_user.meals.recent_first
  end

  def show
  end

  def new
    @meal = current_user.meals.new(eaten_at: Time.zone.now)
  end

  def edit
  end

  def create
    @meal = current_user.meals.new(meal_params)

    if @meal.save
      redirect_to @meal, notice: "Repas cree."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @meal.update(meal_params)
      redirect_to @meal, notice: "Repas mis a jour."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @meal.destroy
    redirect_to meals_path, notice: "Repas supprime."
  end

  private

  def set_meal
    @meal = current_user.meals.find(params[:id])
  end

  def meal_params
    params.require(:meal).permit(:name, :carbs, :eaten_at, :notes)
  end
end
