module MedicationSchedules
  class SyncWindow
    # Resynchronise tous les programmes actifs sur une fenetre calendaire commune.
    def self.call(user:, from:, to:)
      new(user:, from:, to:).call
    end

    def initialize(user:, from:, to:)
      @user = user
      @from = from
      @to = to
    end

    def call
      @user.medication_schedules.active.find_each do |schedule|
        schedule.sync_reminders!(from: @from, to: @to)
      end
    end
  end
end
