class ClinicianAppointment < ApplicationRecord
  # Rendez-vous structure entre un soignant et un patient.
  APPOINTMENT_TYPES = %w[in_person teleconsultation follow_up review].freeze
  STATUSES = %w[scheduled preparing confirmed completed cancelled].freeze

  belongs_to :clinician, class_name: "User"
  belongs_to :patient, class_name: "User"

  validates :appointment_type, inclusion: { in: APPOINTMENT_TYPES }
  validates :status, inclusion: { in: STATUSES }
  validates :starts_at, :reason, presence: true
  validate :clinician_must_have_clinician_role
  validate :patient_must_have_patient_role
  validate :ends_at_is_after_starts_at

  scope :chronological, -> { order(:starts_at) }
  scope :recent_first, -> { order(starts_at: :desc) }
  scope :upcoming, -> { where("starts_at >= ?", Time.zone.now).chronological }

  def day_label(reference_date = Time.zone.today)
    return "Aujourd'hui" if starts_at.to_date == reference_date
    return "Demain" if starts_at.to_date == reference_date + 1.day

    I18n.l(starts_at.to_date, format: "%A")
  end

  def time_label
    starts_at.strftime("%H:%M")
  end

  def status_tone
    case status
    when "preparing", "cancelled" then "rose"
    when "scheduled" then "amber"
    when "confirmed", "completed" then "teal"
    else "blue"
    end
  end

  def mockup_status_label
    {
      "scheduled" => "A venir",
      "preparing" => "A preparer",
      "confirmed" => "Confirme",
      "completed" => "Termine",
      "cancelled" => "Annule"
    }.fetch(status, "A venir")
  end

  def mockup_type_label
    {
      "in_person" => "Consultation",
      "teleconsultation" => "Teleconsultation",
      "follow_up" => "Suivi clinique",
      "review" => "Revue clinique"
    }.fetch(appointment_type, "Consultation")
  end

  private

  def clinician_must_have_clinician_role
    errors.add(:clinician, "doit etre un soignant") unless clinician&.clinician?
  end

  def patient_must_have_patient_role
    errors.add(:patient, "doit etre un patient") unless patient&.patient?
  end

  def ends_at_is_after_starts_at
    return if ends_at.blank? || ends_at > starts_at

    errors.add(:ends_at, "doit etre apres le debut")
  end
end
