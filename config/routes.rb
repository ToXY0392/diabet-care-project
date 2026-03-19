Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  root "pages#dashboard"
  get "dashboard" => "pages#dashboard"
  resource :patient_profile, only: %i[show edit update]
  resource :session, only: %i[new create destroy]
  resource :dexcom_connection, only: %i[destroy], controller: "dexcom_connections" do
    get :connect
    get :callback
    post :sync
  end
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
end
