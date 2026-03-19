class GlucoseReadingsController < ApplicationController
  # CRUD des mesures glycemiques manuelles et Dexcom visibles par le patient.
  before_action :set_glucose_reading, only: %i[show edit update destroy]

  def index
    @glucose_readings = current_user.glucose_readings.recent_first
  end

  def show
  end

  def new
    @glucose_reading = current_user.glucose_readings.new(measured_at: Time.zone.now)
  end

  def edit
  end

  def create
    @glucose_reading = current_user.glucose_readings.new(glucose_reading_params)

    if @glucose_reading.save
      redirect_to @glucose_reading, notice: "Mesure glycemique creee."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @glucose_reading.update(glucose_reading_params)
      redirect_to @glucose_reading, notice: "Mesure glycemique mise a jour."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @glucose_reading.destroy
    redirect_to glucose_readings_path, notice: "Mesure glycemique supprimee."
  end

  private

  def set_glucose_reading
    @glucose_reading = current_user.glucose_readings.find(params[:id])
  end

  def glucose_reading_params
    params.require(:glucose_reading).permit(:value, :measured_at, :context, :notes)
  end
end
