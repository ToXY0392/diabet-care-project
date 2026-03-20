require "test_helper"

# Verifie l'acces au dashboard admin et le refus pour les comptes non admin.
class AdminDashboardTest < ActionDispatch::IntegrationTest
  test "admin can access the admin dashboard" do
    sign_in_session!(users(:admin))

    assert_redirected_to admin_dashboard_path
    follow_redirect!

    assert_response :success
    assert_includes response.body, "Dashboard admin"
    assert_includes response.body, "Comptes patients"
  end

  test "non admin cannot access the admin dashboard" do
    sign_in_session!(users(:demo))
    get admin_dashboard_path

    assert_redirected_to dashboard_path
  end
end
