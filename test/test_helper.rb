ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"

module ActiveSupport
  class TestCase
    # Run tests in parallel with specified workers
    parallelize(workers: :number_of_processors, with: :threads)

    # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
    fixtures :all

    # Add more helper methods to be used by all tests here...
  end
end

class ActionDispatch::IntegrationTest
  # Simule POST /choisir-profil puis POST /session pour les tests d'integration (aligne sur le flux reel).
  def sign_in_session!(user, password: "password123", follow: false)
    post choose_profile_path, params: { role: user.role }
    post session_path, params: { email: user.email, password: password }
    follow_redirect! if follow && response.redirect?
  end
end
