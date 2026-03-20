require "test_helper"

class DashboardMockupRenderingTest < ActionDispatch::IntegrationTest
  test "injects real clinician data into the mockup html" do
    sign_in_session!(users(:demo), follow: true)

    assert_response :success
    assert_includes response.body, "Dr Camille Martin"
    assert_includes response.body, "2 patients suivis"
    assert_includes response.body, %("name": "Other Patient")
    assert_includes response.body, %("email": "other@example.com")
    assert_includes response.body, %("title": "Other Patient")
    assert_includes response.body, %("patientName": "Other Patient")
    assert_includes response.body, "Prioriser Demo Patient cet apres-midi"
  end

  test "injects clinician persistence bridge for clinician sessions" do
    sign_in_session!(users(:clinician), follow: true)

    assert_response :success
    assert_includes response.body, '"enabled":true'
    assert_includes response.body, "/clinician/conversations"
    assert_includes response.body, "/clinician/clinical_notes"
    assert_includes response.body, "/clinician/patient_records"
    assert_includes response.body, "persistCoordinationNote"
    assert_includes response.body, "persistMessage"
    assert_includes response.body, "persistPatientRecord"
    assert_includes response.body, %("serverPatientRecordId":)
    assert_includes response.body, %("phone":"06 44 55 66 77")
  end
end
