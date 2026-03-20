require "test_helper"

class SessionsLogoutTest < ActionDispatch::IntegrationTest
  test "logout redirects to root role selection screen" do
    sign_in_session!(users(:demo))

    delete session_path

    assert_redirected_to root_path
    follow_redirect!

    assert_response :success
    assert_includes response.body, "Je suis patient"
    assert_includes response.body, "Je suis soignant"
  end
end
