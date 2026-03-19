class DexcomConnection < ApplicationRecord
  # Conserve les jetons et l'etat de liaison entre un utilisateur et Dexcom.
  belongs_to :user

  validates :access_token, :refresh_token, :expires_at, :environment, presence: true

  scope :active, -> { where(revoked_at: nil) }

  def expired?
    expires_at <= 5.minutes.from_now
  end

  def active?
    revoked_at.nil?
  end
end
