# Namespace reserve aux utilisateurs avec le role `admin` (pilotage plateforme, distinct du soignant clinique).
module Admin
  class BaseController < ApplicationController
    # Base commune : verifie le role avant chaque action d'administration.
    before_action :require_admin
  end
end
