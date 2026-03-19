class MedicationRemindersController < ApplicationController
  before_action :set_medication_reminder, only: %i[show edit update destroy mark_taken]

  def index
    sync_schedules
    @medication_reminders = current_user.medication_reminders.includes(:medication_schedule).recent_first
    @today_reminders = current_user.medication_reminders.due_today.order(:scheduled_at)
    evaluate_today_alerts
  end

  def show
  end

  def new
    @medication_reminder = current_user.medication_reminders.new(scheduled_at: Time.zone.now.change(min: 0))
  end

  def edit
  end

  def create
    @medication_reminder = current_user.medication_reminders.new(medication_reminder_params)

    if @medication_reminder.save
      HealthAlerts::EvaluateMedicationReminder.call(@medication_reminder)
      redirect_to @medication_reminder, notice: "Rappel de traitement cree."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @medication_reminder.update(medication_reminder_params)
      HealthAlerts::EvaluateMedicationReminder.call(@medication_reminder)
      redirect_to @medication_reminder, notice: "Rappel de traitement mis a jour."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @medication_reminder.destroy
    redirect_to medication_reminders_path, notice: "Rappel de traitement supprime."
  end

  def mark_taken
    @medication_reminder.update!(taken_at: Time.zone.now)
    HealthAlerts::EvaluateMedicationReminder.call(@medication_reminder)
    redirect_back fallback_location: medication_reminders_path, notice: "Traitement marque comme pris."
  end

  private

  def set_medication_reminder
    @medication_reminder = current_user.medication_reminders.find(params[:id])
  end

  def medication_reminder_params
    params.require(:medication_reminder).permit(:medication_name, :dosage, :scheduled_at, :instructions, :taken_at, :medication_schedule_id)
  end

  def sync_schedules
    MedicationSchedules::SyncWindow.call(user: current_user, from: Date.current - 7.days, to: Date.current + 14.days)
  end

  def evaluate_today_alerts
    @today_reminders.each do |reminder|
      HealthAlerts::EvaluateMedicationReminder.call(reminder)
    end
  end
end
