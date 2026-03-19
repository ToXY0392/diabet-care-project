module Clinician
  class BaseController < ApplicationController
    # Base commune des endpoints soignant : authentification, role et scope patient.
    before_action :require_clinician

    private

    def current_clinician
      current_user
    end

    def clinician_patient_scope
      User.patients.order(:name)
    end
  end
end
