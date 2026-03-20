require "test_helper"

class PagesRoleSelectTest < ActionDispatch::IntegrationTest
  test "root shows patient and clinician selection for guests" do
    get root_path

    assert_response :success
    assert_includes response.body, "Je suis patient"
    assert_includes response.body, "Je suis soignant"
  end

  test "root redirects signed in users to their dashboard" do
    sign_in_session!(users(:demo))

    get root_path

    assert_redirected_to dashboard_path(phone: "1")
  end
end
