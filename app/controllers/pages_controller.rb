class PagesController < ApplicationController
  def dashboard
    # Le dashboard affiche la maquette HTML commune, mais avec des donnees
    # patient ou soignant injectees dynamiquement depuis Rails.
    render html: Dashboard::MockupRenderer.call(user: current_user, window: params[:window], csrf_token: form_authenticity_token).html_safe, layout: false
  end
end
