module Dexcom
  class SyncReadings
    # Importe les mesures Dexcom dans le modele de glycemies de l'application.
    DEFAULT_SYNC_WINDOW = 24.hours

    def self.call(user:, start_time: nil, end_time: Time.zone.now, client: nil)
      new(user:, start_time:, end_time:, client:).call
    end

    def initialize(user:, start_time:, end_time:, client:)
      @user = user
      @connection = user.dexcom_connection
      @start_time = start_time
      @end_time = end_time
      @client = client || Client.new(connection: @connection)
    end

    def call
      raise Error, "Connexion Dexcom manquante." if @connection.blank?

      refresh_connection_if_needed!

      payload = @client.egvs(start_time: sync_start_time, end_time: @end_time)
      records = payload.fetch("records", [])

      imported_count = records.sum { |record| import_record(record) ? 1 : 0 }

      @connection.update!(
        last_synced_at: @end_time,
        external_user_id: payload["userId"].presence || @connection.external_user_id
      )

      imported_count
    end

    private

    def refresh_connection_if_needed!
      return unless @connection.expired?

      @client.refresh_tokens!(@connection)
    rescue ApiError => error
      @connection.update!(revoked_at: Time.zone.now)
      raise Error, "La connexion Dexcom doit etre reliee de nouveau: #{error.message}"
    end

    def sync_start_time
      return @start_time if @start_time.present?
      # On garde un leger chevauchement entre deux synchronisations pour relire
      # sans risque les mesures CGM arrivees en retard; le dedoublonnage se fait
      # ensuite sur source + external_id.
      return [@connection.last_synced_at - 15.minutes, 30.days.ago].max if @connection.last_synced_at.present?

      DEFAULT_SYNC_WINDOW.ago
    end

    def import_record(record)
      external_id = record["recordId"]
      return false if external_id.blank?

      # Dexcom peut renvoyer des mesures deja vues sur des fenetres qui se
      # recouvrent, donc on fait un upsert via l'identifiant fournisseur.
      reading = @user.glucose_readings.find_or_initialize_by(source: "dexcom", external_id: external_id)

      reading.assign_attributes(
        value: normalize_value(record["value"]),
        measured_at: parse_time(record["displayTime"]) || parse_time(record["systemTime"]),
        context: "cgm",
        trend: record["trend"]
      )

      return false unless reading.changed?

      reading.save!
      true
    end

    def parse_time(value)
      Time.zone.parse(value) if value.present?
    end

    def normalize_value(value)
      value.to_i.clamp(39, 401)
    end
  end
end
