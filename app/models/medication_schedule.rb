class MedicationSchedule < ApplicationRecord
  # Un programme de traitement genere automatiquement des rappels sur une plage donnee.
  WEEKDAYS = {
    sunday: 1,
    monday: 2,
    tuesday: 4,
    wednesday: 8,
    thursday: 16,
    friday: 32,
    saturday: 64
  }.freeze

  belongs_to :user
  has_many :medication_reminders, dependent: :destroy

  attr_accessor(*WEEKDAYS.keys.map { |day| "#{day}_enabled" })

  before_validation :apply_selected_weekdays

  validates :medication_name, :dosage, :starts_on, :reminder_times, presence: true
  validate :reminder_times_are_valid
  validate :ends_on_is_after_start
  validate :at_least_one_weekday_selected

  scope :active, -> { where(active: true) }

  def reminder_time_list
    reminder_times.to_s.split(",").map(&:strip).reject(&:blank?)
  end

  def reminder_time_list=(values)
    self.reminder_times = Array(values).join(",")
  end

  def occurs_on?(date)
    active? &&
      date >= starts_on &&
      (ends_on.blank? || date <= ends_on) &&
      weekday_enabled?(date.wday)
  end

  def weekday_enabled?(weekday)
    mask = 2**weekday
    (weekdays_mask & mask).positive?
  end

  def enabled_weekdays
    WEEKDAYS.keys.select.with_index { |_name, index| weekday_enabled?(index) }
  end

  WEEKDAYS.each_key.with_index do |day, index|
    define_method("#{day}_enabled") do
      instance_variable_get(:"@#{day}_enabled").nil? ? weekday_enabled?(index) : ActiveModel::Type::Boolean.new.cast(instance_variable_get(:"@#{day}_enabled"))
    end
  end

  def sync_reminders!(from:, to:)
    range = (from.to_date..to.to_date)
    expected_times = []

    range.each do |date|
      next unless occurs_on?(date)

      reminder_time_list.each do |time_value|
        scheduled_time = Time.zone.parse("#{date} #{time_value}")
        expected_times << scheduled_time
        medication_reminders.find_or_create_by!(scheduled_at: scheduled_time) do |reminder|
          reminder.user = user
          reminder.medication_name = medication_name
          reminder.dosage = dosage
          reminder.instructions = instructions
        end
      end
    end

    # On supprime seulement les rappels encore non pris qui ne correspondent plus
    # au programme courant sur la fenetre synchronisee.
    medication_reminders.where(scheduled_at: from.beginning_of_day..to.end_of_day, taken_at: nil)
                        .where.not(scheduled_at: expected_times)
                        .destroy_all
  end

  private

  def reminder_times_are_valid
    if reminder_time_list.empty?
      errors.add(:reminder_times, "doit contenir au moins une heure")
      return
    end

    invalid_values = reminder_time_list.reject { |value| value.match?(/\A\d{2}:\d{2}\z/) }
    errors.add(:reminder_times, "contient des heures invalides") if invalid_values.any?
  end

  def ends_on_is_after_start
    return if ends_on.blank? || ends_on >= starts_on

    errors.add(:ends_on, "doit etre apres la date de debut")
  end

  def at_least_one_weekday_selected
    errors.add(:weekdays_mask, "doit activer au moins un jour") if weekdays_mask.to_i.zero?
  end

  def apply_selected_weekdays
    return unless WEEKDAYS.keys.any? { |day| !instance_variable_get(:"@#{day}_enabled").nil? }

    self.weekdays_mask = WEEKDAYS.keys.each_with_index.sum do |day, index|
      ActiveModel::Type::Boolean.new.cast(instance_variable_get(:"@#{day}_enabled")) ? 2**index : 0
    end
  end
end
