# frozen_string_literal: true

# Tableau de bord : vue d'ensemble après connexion.
# Affiche les compteurs (glycémies, repas) et les accès rapides.
# L'authentification est gérée par ApplicationController.
class DashboardController < ApplicationController
  def show
    # Les compteurs et liens sont calculés dans la vue via current_user
  end
end
