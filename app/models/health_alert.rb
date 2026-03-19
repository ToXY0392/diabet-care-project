class HealthAlert < ApplicationRecord
  # Les alertes regroupent les ecarts glycemiques et les oublis de traitement.
  ALERT_TYPES = %w[hypoglycemia hyperglycemia medication_overdue medication_missed].freeze
  SEVERITIES = %w[warning critical].freeze

  belongs_to :user
  belongs_to :glucose_reading, optional: true
  belongs_to :medication_reminder, optional: true

  validates :alert_type, inclusion: { in: ALERT_TYPES }
  validates :severity, inclusion: { in: SEVERITIES }
  validates :message, :detected_at, presence: true
  validate :linked_resource_present

  scope :recent_first, -> { order(detected_at: :desc) }
  scope :active, -> { where(resolved_at: nil) }
  scope :unread, -> { where(read_at: nil) }
  scope :unnotified, -> { where(browser_notified_at: nil) }
  scope :unacknowledged, -> { where(acknowledged_at: nil) }

  def read?
    read_at.present?
  end

  def acknowledged?
    acknowledged_at.present?
  end

  def resolved?
    resolved_at.present?
  end

  def status_label
    return "Resolue" if resolved?
    return "Accusee" if acknowledged?

    "Active"
  end

  private

  def linked_resource_present
    return if glucose_reading.present? || medication_reminder.present?

    errors.add(:base, "Une alerte doit etre liee a une mesure glycemique ou a une prise de traitement")
  end
end
