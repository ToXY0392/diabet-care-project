class GlucoseReading < ApplicationRecord
  CONTEXTS = %w[fatigue fasting before_meal after_meal bedtime cgm].freeze
  SOURCES = %w[manual dexcom].freeze

  belongs_to :user
  has_many :health_alerts, dependent: :destroy

  validates :value, presence: true, numericality: { greater_than: 0, less_than: 500 }
  validates :measured_at, presence: true
  validates :context, presence: true, inclusion: { in: CONTEXTS }
  validates :source, presence: true, inclusion: { in: SOURCES }

  scope :recent_first, -> { order(measured_at: :desc) }
  scope :for_today, -> { where(measured_at: Time.zone.today.all_day) }

  after_commit :create_health_alert_if_needed, on: :create

  def in_target_range?(profile = user&.patient_profile)
    return value.between?(70, 180) unless profile

    value.between?(profile.glucose_target_low, profile.glucose_target_high)
  end

  def context_label
    context.humanize
  end

  def source_label
    source.humanize
  end

  private

  def create_health_alert_if_needed
    HealthAlerts::EvaluateReading.call(self)
  end
end
