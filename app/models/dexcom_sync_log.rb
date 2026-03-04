# frozen_string_literal: true

# Historique des synchronisations Dexcom : date et nombre de mesures importées.
# Permet de tracer les imports et éviter les doublons.
class DexcomSyncLog < ApplicationRecord
  belongs_to :user

  validates :last_sync_at, presence: true
  validates :records_imported, numericality: { greater_than_or_equal_to: 0 }
end
