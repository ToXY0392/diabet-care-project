class MedicationReminder < ApplicationRecord
  # Un rappel ponctuel, issu d'un programme recurrent ou saisi manuellement.
  belongs_to :user
  belongs_to :medication_schedule, optional: true
  has_many :health_alerts, dependent: :destroy

  MISSED_AFTER = 4.hours

  validates :medication_name, presence: true
  validates :dosage, presence: true
  validates :scheduled_at, presence: true

  scope :recent_first, -> { order(scheduled_at: :desc) }
  scope :due_today, -> { where(scheduled_at: Time.zone.today.all_day) }
  scope :pending, -> { where(taken_at: nil) }
  scope :taken, -> { where.not(taken_at: nil) }
  scope :for_range, ->(range) { where(scheduled_at: range) }

  def taken?
    taken_at.present?
  end

  def overdue?(reference_time = Time.zone.now)
    !taken? && scheduled_at < reference_time && scheduled_at >= reference_time - MISSED_AFTER
  end

  def missed?(reference_time = Time.zone.now)
    !taken? && scheduled_at < reference_time - MISSED_AFTER
  end

  def pending?(reference_time = Time.zone.now)
    !taken? && scheduled_at >= reference_time
  end

  def status_label
    return "Pris" if taken?
    return "Manque" if missed?
    return "En retard" if overdue?

    "A prendre"
  end
end
