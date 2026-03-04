# Définition des routes de l'application.
# Routes nommées : utiliser _path ou _url (ex: login_path, dashboard_path)
Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  # Pages publiques
  root "pages#home"                                    # Page d'accueil
  get "dashboard", to: "dashboard#show", as: :dashboard  # Tableau de bord (connecté)
  get "privacy", to: "pages#privacy", as: :privacy      # Politique RGPD

  # Authentification
  get "login", to: "sessions#new", as: :login
  post "login", to: "sessions#create"
  delete "logout", to: "sessions#destroy", as: :logout
  get "signup", to: "registrations#new", as: :signup
  post "signup", to: "registrations#create"

  # Ressources (CRUD)
  resources :glucose_readings    # Glycémies
  resources :meals do
    collection do
      get :latest_glucose        # Dernière valeur Dexcom (pour formulaire repas)
    end
  end
  resource :target, only: [:show, :edit, :update]  # Objectifs (singulier : 1 par user)
  resources :reports, only: [:index]               # Rapports & graphiques

  # RGPD
  get "data_export", to: "pages#data_export", as: :data_export
  delete "delete_account", to: "pages#delete_account", as: :delete_account

  # Dexcom OAuth 2.0
  get "dexcom/connect", to: "dexcom#connect", as: :dexcom_connect
  get "dexcom/callback", to: "dexcom_callbacks#callback", as: :dexcom_callback
  post "dexcom/sync", to: "dexcom#sync", as: :dexcom_sync
end
