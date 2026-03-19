class PatientProfilesController < ApplicationController
  # Le profil patient centralise les seuils glycemiques et les preferences
  # utilisees par les calculs du dashboard et des alertes.
  before_action :set_patient_profile

  def show
  end

  def edit
  end

  def update
    if @patient_profile.update(patient_profile_params)
      redirect_to patient_profile_path, notice: "Profil sante mis a jour."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  private

  def set_patient_profile
    @patient_profile = current_user.patient_profile || current_user.create_patient_profile!
  end

  def patient_profile_params
    params.require(:patient_profile).permit(
      :hypo_threshold,
      :hyper_threshold,
      :hypo_critical_threshold,
      :hyper_critical_threshold,
      :glucose_target_low,
      :glucose_target_high,
      :browser_notifications_enabled
    )
  end
end
