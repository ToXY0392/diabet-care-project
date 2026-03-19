class PagesController < ApplicationController
  def dashboard
    render html: Dashboard::MockupRenderer.call(user: current_user, window: params[:window], csrf_token: form_authenticity_token).html_safe, layout: false
  end
end
