class MedicationSchedulesController < ApplicationController
  # Gere les traitements recurrents et regenere la fenetre de rappels associee.
  before_action :set_medication_schedule, only: %i[show edit update destroy]

  def index
    sync_schedule_window
    @medication_schedules = current_user.medication_schedules.order(:medication_name, :created_at)
    @upcoming_doses = current_user.medication_reminders.where(scheduled_at: Time.zone.now..14.days.from_now).order(:scheduled_at).limit(10)
  end

  def show
    sync_schedule_window
    @next_doses = @medication_schedule.medication_reminders.where(scheduled_at: Time.zone.now..14.days.from_now).order(:scheduled_at).limit(14)
  end

  def new
    @medication_schedule = current_user.medication_schedules.new(starts_on: Date.current, reminder_times: "08:00")
  end

  def edit
  end

  def create
    @medication_schedule = current_user.medication_schedules.new(medication_schedule_params)

    if @medication_schedule.save
      sync_schedule!(@medication_schedule)
      redirect_to @medication_schedule, notice: "Programme de traitement cree."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @medication_schedule.update(medication_schedule_params)
      sync_schedule!(@medication_schedule)
      redirect_to @medication_schedule, notice: "Programme de traitement mis a jour."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @medication_schedule.destroy
    redirect_to medication_schedules_path, notice: "Programme de traitement supprime."
  end

  private

  def set_medication_schedule
    @medication_schedule = current_user.medication_schedules.find(params[:id])
  end

  def medication_schedule_params
    params.require(:medication_schedule).permit(
      :medication_name,
      :dosage,
      :instructions,
      :starts_on,
      :ends_on,
      :reminder_times,
      :active,
      weekday_keys
    )
  end

  def weekday_keys
    MedicationSchedule::WEEKDAYS.keys.map { |day| "#{day}_enabled" }
  end

  def sync_schedule_window
    MedicationSchedules::SyncWindow.call(user: current_user, from: Date.current - 7.days, to: Date.current + 14.days)
  end

  def sync_schedule!(schedule)
    schedule.sync_reminders!(from: Date.current - 1.day, to: Date.current + 14.days)
  end
end
