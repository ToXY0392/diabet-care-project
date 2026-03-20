Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Entree : choix patient / soignant, puis connexion sur /connexion (page marketing sur /home).
  root "pages#role_select"
  post "choisir-profil", to: "pages#choose_profile", as: :choose_profile
  get "profil/retour", to: "pages#reset_login_role", as: :reset_login_role
  get "home" => "pages#home"
  get "dashboard" => "pages#dashboard"
  resource :patient_profile, only: %i[show edit update]
  resource :session, only: %i[create destroy]
  get "connexion", to: "sessions#new", as: :login
  resources :password_resets, only: %i[new create edit update], param: :token
  resource :dexcom_connection, only: %i[destroy], controller: "dexcom_connections" do
    get :connect
    get :callback
    post :sync
  end
  # Inscription patient : pose le contexte session puis redirige vers le formulaire (sans passer par le bouton d'accueil).
  get "inscription/patient", to: "users#begin_patient_signup", as: :begin_patient_signup
  resources :users, only: %i[new create]
  resources :health_alerts, only: %i[index] do
    patch :mark_read, on: :member
    patch :acknowledge, on: :member
    patch :resolve, on: :member
    patch :mark_all_read, on: :collection
    get :notifications_feed, on: :collection
  end
  resources :glucose_readings
  resources :journal_entries
  resources :meals
  resources :medication_schedules
  resources :medication_reminders do
    patch :mark_taken, on: :member
  end

  namespace :clinician do
    resources :appointments, only: %i[index create update destroy]
    resources :clinical_notes, only: %i[index create update destroy]
    resources :patient_records, only: %i[show create update]
    resource :coordination_note, only: %i[show create update]
    resources :conversations, only: %i[index show create] do
      patch :mark_read, on: :member
      resources :messages, only: :create, controller: "conversation_messages"
    end
  end

  namespace :admin do
    resource :dashboard, only: :show, controller: "dashboards"
  end
end
