# frozen_string_literal: true

# Modèle utilisateur : compte DiabetCare.
# Stocke email, mot de passe (chiffré), rôle et tokens Dexcom.
class User < ApplicationRecord
  # Chiffrement du mot de passe (bcrypt) - fournit authenticate(password)
  has_secure_password

  # Associations : les données sont supprimées si l'utilisateur est supprimé
  has_many :glucose_readings, dependent: :destroy   # Mesures glycémiques
  has_many :manual_entries, dependent: :destroy     # Entrées manuelles (repas, insuline, activité)
  has_many :meals, dependent: :destroy              # Repas (glucides + bolus)
  has_one :target, dependent: :destroy              # Objectifs glycémiques (min/max)
  has_many :dexcom_sync_logs, dependent: :destroy   # Historique des sync Dexcom

  # Rôles : 0=patient, 1=doctor, 2=admin
  enum :role, { patient: 0, doctor: 1, admin: 2 }

  validates :email, presence: true, uniqueness: true
  validates :password, length: { minimum: 6 }, if: -> { password.present? }
end
