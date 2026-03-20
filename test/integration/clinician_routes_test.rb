require "test_helper"

class ClinicianRoutesTest < ActionDispatch::IntegrationTest
  test "clinician can post a message to an existing conversation" do
    sign_in_session!(users(:clinician))

    assert_difference("ClinicianMessage.count", 1) do
      post clinician_conversation_messages_path(clinician_conversations(:demo_thread)),
           params: { clinician_message: { body: "Je confirme le rendez-vous de cet apres-midi." } }
    end

    assert_response :created
    assert_equal "Je confirme le rendez-vous de cet apres-midi.", ClinicianMessage.order(:created_at).last.body
  end

  test "patient cannot access clinician routes" do
    sign_in_session!(users(:demo))

    get clinician_appointments_path

    assert_redirected_to dashboard_path
  end

  test "clinician can create a conversation with an initial message" do
    sign_in_session!(users(:clinician))
    fresh_patient = User.create!(
      name: "Fresh Patient",
      email: "fresh.patient@example.com",
      role: "patient",
      password: "password123",
      password_confirmation: "password123"
    )

    assert_difference("ClinicianConversation.count", 1) do
      assert_difference("ClinicianMessage.count", 1) do
        post clinician_conversations_path,
             params: {
               clinician_conversation: { patient_id: fresh_patient.id, subject: "Nouveau suivi" },
               initial_message_body: "Bonjour, je vous contacte pour un nouveau suivi."
             }
      end
    end

    assert_response :created
    assert_equal "Bonjour, je vous contacte pour un nouveau suivi.", ClinicianMessage.order(:created_at).last.body
  end

  test "clinician can create a patient record" do
    sign_in_session!(users(:clinician))
    fresh_patient = User.create!(
      name: "Fresh Patient",
      email: "fresh.patient.record@example.com",
      role: "patient",
      password: "password123",
      password_confirmation: "password123"
    )

    assert_difference("ClinicianPatientProfile.count", 1) do
      post clinician_patient_records_path,
           params: {
             patient_record: {
               patient_id: fresh_patient.id,
               name: "Fresh Patient Updated",
               email: "fresh.updated@example.com",
               sex: "Femme",
               age: 39,
               height: "170 cm",
               weight: "65 kg",
               diagnosis: "Diabete type 1",
               treatment: "Insuline",
               ordonnance: "Renouvellement",
               phone: "06 00 00 00 00",
               contact: "Proche aidant"
             }
           }
    end

    assert_response :created
    fresh_patient.reload
    assert_equal "Fresh Patient Updated", fresh_patient.name
    assert_equal "fresh.updated@example.com", fresh_patient.email
    assert_equal "Insuline", fresh_patient.clinician_patient_profile.treatment
  end

  test "clinician can update an existing patient record" do
    sign_in_session!(users(:clinician))
    record = clinician_patient_profiles(:demo_record)

    patch clinician_patient_record_path(record),
          params: {
            patient_record: {
              name: "Demo Patient Revised",
              email: "demo.revised@example.com",
              treatment: "Pompe + capteur",
              contact: "Nouveau contact"
            }
          }

    assert_response :success
    assert_equal "Demo Patient Revised", users(:demo).reload.name
    assert_equal "demo.revised@example.com", users(:demo).reload.email
    assert_equal "Pompe + capteur", record.reload.treatment
    assert_equal "Nouveau contact", record.reload.contact
  end
end
