def ensure_user(email:, name:, role:)
  User.find_or_create_by!(email:) do |user|
    user.name = name
    user.role = role
    user.password = "password123"
    user.password_confirmation = "password123"
  end.tap do |user|
    user.update!(name:, role:)
  end
end

def seed_patient_profile(user, attributes)
  profile = user.patient_profile || user.create_patient_profile!
  profile.update!(attributes)
end

def seed_readings(user, readings)
  readings.each do |attributes|
    user.glucose_readings.find_or_create_by!(measured_at: attributes[:measured_at]) do |reading|
      reading.value = attributes[:value]
      reading.context = attributes[:context]
      reading.notes = attributes[:notes]
    end
  end
end

def seed_meals(user, meals)
  meals.each do |attributes|
    user.meals.find_or_create_by!(eaten_at: attributes[:eaten_at], name: attributes[:name]) do |meal|
      meal.carbs = attributes[:carbs]
      meal.notes = attributes[:notes]
    end
  end
end

def seed_schedules(user, schedules)
  schedules.each do |attributes|
    schedule = user.medication_schedules.find_or_create_by!(medication_name: attributes[:medication_name], dosage: attributes[:dosage]) do |record|
      record.starts_on = attributes[:starts_on]
      record.reminder_times = attributes[:reminder_times]
      record.instructions = attributes[:instructions]
      record.weekdays_mask = attributes[:weekdays_mask]
    end

    schedule.update!(attributes)
    schedule.sync_reminders!(from: Date.current - 2.days, to: Date.current + 7.days)
  end
end

def seed_journal_entries(user, entries)
  entries.each do |attributes|
    user.journal_entries.find_or_create_by!(recorded_at: attributes[:recorded_at]) do |entry|
      entry.mood = attributes[:mood]
      entry.activity_minutes = attributes[:activity_minutes]
      entry.symptoms = attributes[:symptoms]
      entry.notes = attributes[:notes]
    end
  end
end

def evaluate_health_data!(user)
  user.glucose_readings.find_each do |reading|
    HealthAlerts::EvaluateReading.call(reading)
  end

  user.medication_reminders.find_each do |reminder|
    HealthAlerts::EvaluateMedicationReminder.call(reminder)
  end
end

demo_user = ensure_user(email: "demo@diabetcare.local", name: "Demo Patient", role: "patient")
other_patient = ensure_user(email: "other@diabetcare.local", name: "Other Patient", role: "patient")
clinician = ensure_user(email: "clinician@diabetcare.local", name: "Dr Camille Martin", role: "clinician")

seed_patient_profile(
  demo_user,
  hypo_threshold: 72,
  hyper_threshold: 185,
  hypo_critical_threshold: 54,
  hyper_critical_threshold: 250,
  glucose_target_low: 80,
  glucose_target_high: 170,
  browser_notifications_enabled: true
)

seed_patient_profile(
  other_patient,
  hypo_threshold: 70,
  hyper_threshold: 180,
  hypo_critical_threshold: 54,
  hyper_critical_threshold: 250,
  glucose_target_low: 75,
  glucose_target_high: 165,
  browser_notifications_enabled: true
)

demo_record = demo_user.clinician_patient_profile || demo_user.build_clinician_patient_profile
demo_record.update!(
  sex: "Femme",
  age: 36,
  height: "168 cm",
  weight: "64 kg",
  diagnosis: "Diabète type 1",
  treatment: "Metformine + Insuline rapide",
  ordonnance: "Renouvellement capteurs + schema basal-bolus",
  phone: "06 12 34 56 78",
  contact: "Sophie Martin · 06 98 76 54 32"
)

other_record = other_patient.clinician_patient_profile || other_patient.build_clinician_patient_profile
other_record.update!(
  sex: "Homme",
  age: 42,
  height: "181 cm",
  weight: "80 kg",
  diagnosis: "Diabète type 2",
  treatment: "Metformine 850 mg",
  ordonnance: "Controle trimestriel + renouvellement traitement",
  phone: "06 44 55 66 77",
  contact: "Julie Durand · 06 22 11 33 44"
)

seed_readings(
  demo_user,
  [
    { value: 109, measured_at: Time.zone.now.beginning_of_day + 7.hours + 30.minutes, context: "fasting", notes: "Mesure a jeun stable" },
    { value: 62, measured_at: Time.zone.now.beginning_of_day + 10.hours + 15.minutes, context: "cgm", notes: "Hypoglycemie detectee en fin de matinee" },
    { value: 126, measured_at: Time.zone.now.beginning_of_day + 12.hours + 45.minutes, context: "before_meal", notes: "Avant le dejeuner" },
    { value: 154, measured_at: Time.zone.now.beginning_of_day + 14.hours + 15.minutes, context: "after_meal", notes: "Apres le repas de midi" },
    { value: 248, measured_at: Time.zone.now.beginning_of_day + 18.hours, context: "cgm", notes: "Hyperglycemie en fin de journee" },
    { value: 118, measured_at: Time.zone.now.beginning_of_day - 1.day + 8.hours, context: "fasting", notes: "Bonne tendance matinale" },
    { value: 132, measured_at: Time.zone.now.beginning_of_day - 2.days + 13.hours, context: "after_meal", notes: "Legere hausse apres repas" },
    { value: 111, measured_at: Time.zone.now.beginning_of_day - 3.days + 22.hours, context: "bedtime", notes: "Controle du soir" }
  ]
)

seed_readings(
  other_patient,
  [
    { value: 102, measured_at: Time.zone.now.beginning_of_day + 7.hours, context: "fasting", notes: "Bonne tendance matinale" },
    { value: 138, measured_at: Time.zone.now.beginning_of_day + 9.hours + 10.minutes, context: "after_meal", notes: "Variation moderee apres le petit dejeuner" },
    { value: 121, measured_at: Time.zone.now.beginning_of_day + 13.hours, context: "before_meal", notes: "Avant le dejeuner" },
    { value: 146, measured_at: Time.zone.now.beginning_of_day + 15.hours, context: "after_meal", notes: "Apres le dejeuner" },
    { value: 118, measured_at: Time.zone.now.beginning_of_day - 1.day + 22.hours, context: "bedtime", notes: "Controle du soir" }
  ]
)

seed_meals(
  demo_user,
  [
    { name: "Petit dejeuner", carbs: 32, eaten_at: Time.zone.now.beginning_of_day + 8.hours, notes: "Pain complet et yaourt" },
    { name: "Dejeuner", carbs: 58, eaten_at: Time.zone.now.beginning_of_day + 13.hours, notes: "Riz, poulet et legumes" },
    { name: "Diner", carbs: 41, eaten_at: Time.zone.now.beginning_of_day - 1.day + 20.hours, notes: "Soupe et tartines" },
    { name: "Collation", carbs: 18, eaten_at: Time.zone.now.beginning_of_day - 2.days + 16.hours, notes: "Fruit et noix" }
  ]
)

seed_meals(
  other_patient,
  [
    { name: "Petit dejeuner", carbs: 28, eaten_at: Time.zone.now.beginning_of_day + 8.hours + 10.minutes, notes: "Flocons d'avoine et fruits" },
    { name: "Dejeuner", carbs: 44, eaten_at: Time.zone.now.beginning_of_day + 12.hours + 45.minutes, notes: "Salade composee" }
  ]
)

seed_schedules(
  demo_user,
  [
    { medication_name: "Metformine", dosage: "500 mg", starts_on: Date.current - 14.days, reminder_times: "08:00,20:00", instructions: "A prendre pendant les repas", weekdays_mask: 127 },
    { medication_name: "Insuline rapide", dosage: "6 unites", starts_on: Date.current - 14.days, reminder_times: "12:30", instructions: "Avant le dejeuner", weekdays_mask: 127 }
  ]
)

seed_schedules(
  other_patient,
  [
    { medication_name: "Metformine", dosage: "850 mg", starts_on: Date.current - 7.days, reminder_times: "08:30,19:30", instructions: "A prendre au debut du repas", weekdays_mask: 127 }
  ]
)

demo_user.medication_reminders.where(medication_name: "Metformine", scheduled_at: Time.zone.now.beginning_of_day + 8.hours).update_all(taken_at: Time.zone.now.beginning_of_day + 8.hours + 10.minutes)
demo_user.medication_reminders.where(medication_name: "Metformine", scheduled_at: Time.zone.now.beginning_of_day - 1.day + 20.hours).update_all(taken_at: Time.zone.now.beginning_of_day - 1.day + 20.hours + 5.minutes)
other_patient.medication_reminders.where(medication_name: "Metformine", scheduled_at: Time.zone.now.beginning_of_day + 8.hours + 30.minutes).update_all(taken_at: Time.zone.now.beginning_of_day + 8.hours + 40.minutes)

seed_journal_entries(
  demo_user,
  [
    { recorded_at: Time.zone.now.beginning_of_day + 9.hours + 30.minutes, mood: "good", activity_minutes: 20, symptoms: "Legere fatigue avant collation", notes: "Marche rapide ce matin" },
    { recorded_at: Time.zone.now.beginning_of_day + 18.hours + 20.minutes, mood: "low", activity_minutes: 0, symptoms: "Soif et maux de tete", notes: "A surveiller apres l'hyperglycemie du soir" },
    { recorded_at: Time.zone.now.beginning_of_day - 1.day + 21.hours, mood: "neutral", activity_minutes: 35, symptoms: "", notes: "Journee globalement stable" }
  ]
)

seed_journal_entries(
  other_patient,
  [
    { recorded_at: Time.zone.now.beginning_of_day + 10.hours, mood: "good", activity_minutes: 30, symptoms: "", notes: "Marche reguliere apres le petit dejeuner" }
  ]
)

evaluate_health_data!(demo_user)
evaluate_health_data!(other_patient)

demo_appointment = clinician.clinician_appointments_as_clinician.find_or_create_by!(patient: demo_user, starts_at: Time.zone.now.beginning_of_day + 16.hours + 30.minutes) do |appointment|
  appointment.ends_at = Time.zone.now.beginning_of_day + 17.hours
  appointment.appointment_type = "teleconsultation"
  appointment.status = "preparing"
  appointment.reason = "Revue des alertes glycemiques de la journee"
  appointment.preparation_notes = "Verifier les mesures post-repas et les notes de journal."
end

other_appointment = clinician.clinician_appointments_as_clinician.find_or_create_by!(patient: other_patient, starts_at: 1.day.from_now.beginning_of_day + 10.hours) do |appointment|
  appointment.ends_at = 1.day.from_now.beginning_of_day + 10.hours + 30.minutes
  appointment.appointment_type = "follow_up"
  appointment.status = "confirmed"
  appointment.reason = "Point de suivi hebdomadaire"
  appointment.preparation_notes = "Valider l'observance du traitement."
end

demo_conversation = clinician.clinician_conversations_as_clinician.find_or_create_by!(patient: demo_user) do |conversation|
  conversation.subject = "Suivi glycémique post-dejeuner"
  conversation.status = "active"
end

other_conversation = clinician.clinician_conversations_as_clinician.find_or_create_by!(patient: other_patient) do |conversation|
  conversation.subject = "Point traitement hebdomadaire"
  conversation.status = "active"
end

[
  [demo_conversation, demo_user, "Pouvez-vous partager vos valeurs post-dejeuner ?", Time.zone.now.beginning_of_day + 11.hours + 42.minutes],
  [demo_conversation, clinician, "Oui, je les analyse cet apres-midi.", Time.zone.now.beginning_of_day + 11.hours + 50.minutes],
  [other_conversation, other_patient, "Merci pour votre retour sur le traitement.", Time.zone.now.beginning_of_day + 9.hours + 15.minutes]
].each do |conversation, author, body, sent_at|
  conversation.clinician_messages.find_or_create_by!(author:, sent_at:) do |message|
    message.body = body
  end
end

demo_conversation.participant_for(clinician)&.update!(unread_count: 1)
other_conversation.participant_for(clinician)&.update!(unread_count: 0)

clinician.clinical_notes_as_clinician.find_or_create_by!(patient: demo_user, recorded_at: Time.zone.now.beginning_of_day + 12.hours) do |note|
  note.title = "Note clinique"
  note.body = "Surveiller la derive glycemique apres le dejeuner."
  note.category = "follow_up"
  note.pinned = true
end

clinician.clinical_notes_as_clinician.find_or_create_by!(patient: other_patient, recorded_at: Time.zone.now.beginning_of_day + 9.hours) do |note|
  note.title = "Coordination traitement"
  note.body = "Maintenir le suivi hebdomadaire et confirmer la tolerance du traitement."
  note.category = "coordination"
  note.pinned = false
end

clinician.coordination_notes.find_or_create_by!(title: "Note de coordination") do |note|
  note.body = "Prioriser Demo Patient cet apres-midi puis verifier le suivi de Other Patient demain matin."
  note.active = true
end
