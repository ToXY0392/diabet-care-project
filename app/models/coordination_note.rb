class CoordinationNote < ApplicationRecord
  belongs_to :clinician, class_name: "User"

  validates :title, :body, presence: true
  validate :clinician_must_have_clinician_role

  scope :active, -> { where(active: true) }
  scope :recent_first, -> { order(updated_at: :desc, created_at: :desc) }

  private

  def clinician_must_have_clinician_role
    errors.add(:clinician, "doit etre un soignant") unless clinician&.clinician?
  end
end
