module Dashboard
  class MockupRenderer
    include ActionView::Helpers::DateHelper
    include ERB::Util
    include Rails.application.routes.url_helpers

    TEMPLATE_MARKER = '<template id="soignant-template">'.freeze
    TEMPLATE_PATH = Rails.root.join("../doc/index.html")

    def self.call(user:, window:, csrf_token: nil)
      dashboard_data = Dashboard::BuildData.call(user:, window:)
      new(user:, dashboard_data:, csrf_token:).call
    end

    def initialize(user:, dashboard_data:, csrf_token:)
      @user = user
      @dashboard_data = dashboard_data
      @profile = dashboard_data[:patient_profile]
      @range = dashboard_data[:range]
      @latest_reading = user.glucose_readings.where(measured_at: @range).recent_first.first || user.glucose_readings.recent_first.first
      @today_reminders = dashboard_data[:today_reminders]
      @recent_alerts = dashboard_data[:recent_alerts]
      @latest_journal_entry = user.journal_entries.order(recorded_at: :desc).first
      @dexcom_connection = user.dexcom_connection
      @window = dashboard_data[:window]
      @csrf_token = csrf_token
    end

    def call
      # Le dashboard patient visible et le template soignant vivent dans le
      # meme fichier source, donc on personnalise chaque moitie separement.
      visible_html, clinician_template = File.read(TEMPLATE_PATH).split(TEMPLATE_MARKER, 2)
      personalize_visible_markup!(visible_html)
      personalize_clinician_markup!(clinician_template)
      [visible_html, TEMPLATE_MARKER, clinician_template].join
    end

    private

    def personalize_visible_markup!(html)
      inject_before_marker!(html, "</head>", %(\n<meta name="csrf-token" content="#{h(@csrf_token)}">\n))

      2.times do
        replace_once!(html, "<strong>Marie Dupont</strong>", "<strong>#{h(@user.name)}</strong>")
      end

      replace_once!(html, "<span>Suivi connecté • 3 rappels actifs</span>", "<span>#{h(patient_subtitle)}</span>")
      replace_once!(html, "<strong>118 mg/dL</strong>", "<strong>#{h(current_glucose_value)}</strong>")
      replace_once!(html, '<span class="pill mint">Dans la cible</span>', %(<span class="pill #{current_glucose_pill_class}">#{h(current_glucose_status)}</span>))
      replace_once!(html, '<div class="muted">Dernier relevé · 12:10</div>', %(<div class="muted">#{h(current_glucose_caption)}</div>))
      replace_once!(html, "<strong>74%</strong>", "<strong>#{h(time_in_target_value)}</strong>")
      replace_once!(html, '<span class="pill orange">+4% / 7j</span>', %(<span class="pill #{time_in_target_pill_class}">#{h(time_in_target_badge)}</span>))
      replace_once!(html, '<div class="muted">Objectif 70-180 mg/dL</div>', %(<div class="muted">#{h(target_range_text)}</div>))
      replace_once!(html, '<div class="muted">Capteur Dexcom G7 · Synchronisé il y a 5 min</div>', %(<div class="muted">#{h(sync_caption)}</div>))
      replace_once!(html, '<span class="legend-chip">Cible 70-180 mg/dL</span>', %(<span class="legend-chip">#{h(target_legend)}</span>))

      replace_once!(html, "Date de naissance", "Email")
      replace_once!(html, "12/03/1987", h(@user.email))
      replace_once!(html, "Téléphone", "Seuil hypo")
      replace_once!(html, "+33 6 22 45 78 90", "#{@profile.hypo_threshold} mg/dL")
      replace_once!(html, "Médecin référent", "Seuil hyper")
      replace_once!(html, "Dr Martin", "#{@profile.hyper_threshold} mg/dL")
      replace_once!(html, "Diabétologie", "Objectif glycémique")
      replace_once!(html, "Type 1 · Diagnostiqué 2014", "#{@profile.glucose_target_low}-#{@profile.glucose_target_high} mg/dL")
      replace_once!(html, "Insuline basale + bolus · Capteur CGM", h(treatment_summary))

      replace_once!(html, "Ordonnance Insuline · Mars 2026", "Connexion Dexcom")
      replace_once!(html, '<span class="pill sky">Télécharger</span>', %(<span class="pill #{connection_status_pill_class}">#{h(connection_status_label)}</span>))
      replace_once!(html, "Renouvellement capteur", "Profil glycémique")
      replace_once!(html, '<span class="pill mint">Disponible</span>', %(<span class="pill mint">#{h("#{@window} jours")}</span>))
      replace_once!(html, "Bilan trimestriel", "Dernière note journal")
      replace_once!(html, "Dernière mise à jour 05/03/2026", h(latest_journal_entry_caption))

      replace_once!(html, '<span class="pill orange">3 actives</span>', %(<span class="pill orange">#{h("#{notification_items.count { |item| item[:title] != 'Suivi à jour' }} actives")}</span>))
      replace_once!(html, "Rappel insuline lente", h(notification_items[0][:title]))
      replace_once!(html, '<span class="pill sky">20:00</span>', %(<span class="pill #{notification_items[0][:pill_class]}">#{h(notification_items[0][:badge])}</span>))
      replace_once!(html, "Mesure post-déjeuner", h(notification_items[1][:title]))
      replace_once!(html, '<span class="pill mint">15:30</span>', %(<span class="pill #{notification_items[1][:pill_class]}">#{h(notification_items[1][:badge])}</span>))
      replace_once!(html, "Capteur à renouveler", h(notification_items[2][:title]))
      replace_once!(html, '<span class="pill rose">Dans 5 jours</span>', %(<span class="pill #{notification_items[2][:pill_class]}">#{h(notification_items[2][:badge])}</span>))

      replace_once!(html, '<span class="pill mint">Activées</span>', %(<span class="pill #{browser_notifications_pill_class}">#{h(browser_notifications_label)}</span>))
      replace_once!(html, "Partage des données", "Synchronisation capteur")
      replace_once!(html, '<span class="pill orange">Médecin uniquement</span>', %(<span class="pill #{sensor_sync_pill_class}">#{h(sensor_sync_label)}</span>))

      replace_once!(html, "Bonjour Marie, pouvez-vous noter vos glycémies post-déjeuner ?", "Bonjour #{h(first_name)}, pouvez-vous noter vos glycémies post-déjeuner ?")
    end

    def personalize_clinician_markup!(html)
      replace_once!(html, "Dr Claire Lambert", clinician_name)
      replace_once!(html, "Endocrinologie • 24 patients actifs", clinician_subtitle)
      replace_js_array!(html, "patients", clinician_patients_payload)
      replace_js_array!(html, "conversations", clinician_conversations_payload)
      replace_js_array!(html, "appointments", clinician_appointments_payload)
      inject_before_marker!(html, "const state = {", seeded_clinician_state_script)
      inject_before_marker!(html, "</script>", clinician_persistence_bridge_script)
    end

    def replace_once!(html, old_value, new_value)
      return if html.sub!(old_value, new_value)

      raise "Mockup fragment not found: #{old_value.tr("\n", " ")[0, 80]}"
    end

    def replace_js_array!(html, name, values)
      pattern = /(const #{Regexp.escape(name)} = )\[(?:.|\n)*?\](;)/m
      replacement = "\\1#{JSON.pretty_generate(values)}\\2"
      return if html.sub!(pattern, replacement)

      raise "Mockup array not found: #{name}"
    end

    def inject_before_marker!(html, marker, addition)
      return if html.sub!(marker, "#{addition}#{marker}")

      raise "Mockup marker not found: #{marker}"
    end

    def first_name
      @user.name.to_s.split.first.presence || "patient"
    end

    def patient_subtitle
      mode = @dexcom_connection&.revoked_at? ? "Suivi quotidien" : "Suivi connecté"
      count = @today_reminders.reject(&:taken?).count
      "#{mode} • #{count} #{'rappel'.pluralize(count)} actif#{'s' if count != 1}"
    end

    def current_glucose_value
      return "Aucune donnée" unless @latest_reading

      "#{@latest_reading.value} mg/dL"
    end

    def current_glucose_status
      return "À compléter" unless @latest_reading
      return "Dans la cible" if @latest_reading.in_target_range?(@profile)
      return "Hypoglycémie" if @latest_reading.value < @profile.hypo_threshold
      return "Hyperglycémie" if @latest_reading.value > @profile.hyper_threshold

      "À surveiller"
    end

    def current_glucose_pill_class
      return "sky" unless @latest_reading
      return "mint" if @latest_reading.in_target_range?(@profile)
      return "rose" if @latest_reading.value < @profile.hypo_critical_threshold || @latest_reading.value > @profile.hyper_critical_threshold

      "orange"
    end

    def current_glucose_caption
      return "Ajoutez une première mesure" unless @latest_reading

      "Dernier relevé · #{@latest_reading.measured_at.strftime('%H:%M')}"
    end

    def time_in_target_value
      "#{time_in_target_percent}%"
    end

    def time_in_target_percent
      readings = @user.glucose_readings.where(measured_at: @range)
      return 0 if readings.empty?

      ((readings.count { |reading| reading.in_target_range?(@profile) }.to_f / readings.size) * 100).round
    end

    def time_in_target_badge
      "#{@user.glucose_readings.where(measured_at: @range).count} mesures / #{@window}j"
    end

    def time_in_target_pill_class
      time_in_target_percent >= 70 ? "mint" : "orange"
    end

    def target_range_text
      "Objectif #{@profile.glucose_target_low}-#{@profile.glucose_target_high} mg/dL"
    end

    def target_legend
      "Cible #{@profile.glucose_target_low}-#{@profile.glucose_target_high} mg/dL"
    end

    def sync_caption
      if @dexcom_connection&.last_synced_at.present?
        "Capteur Dexcom · Synchronisé il y a #{time_ago_in_words(@dexcom_connection.last_synced_at)}"
      elsif @latest_reading
        "Mesures #{source_label_for(@latest_reading)} · Dernière activité il y a #{time_ago_in_words(@latest_reading.measured_at)}"
      else
        "Aucune synchronisation active"
      end
    end

    def source_label_for(reading)
      reading.source == "dexcom" ? "Dexcom" : "manuelles"
    end

    def treatment_summary
      items = @user.medication_schedules.order(:medication_name).limit(2).map(&:medication_name)
      items = @today_reminders.map(&:medication_name).uniq.first(2) if items.empty?

      items.any? ? items.join(" + ") : "Aucun traitement planifié"
    end

    def connection_status_label
      return "Connectée" if @dexcom_connection&.revoked_at.blank? && @dexcom_connection.present?

      "À relier"
    end

    def connection_status_pill_class
      @dexcom_connection&.revoked_at.blank? && @dexcom_connection.present? ? "mint" : "orange"
    end

    def latest_journal_entry_caption
      return "Aucune note enregistrée" unless @latest_journal_entry

      "Mise à jour #{I18n.l(@latest_journal_entry.recorded_at.to_date, format: '%d/%m/%Y')}"
    end

    def notification_items
      @notification_items ||= begin
        items = []

        @recent_alerts.each do |alert|
          items << {
            title: alert_title(alert),
            badge: alert.detected_at.strftime("%H:%M"),
            pill_class: alert.severity == "critical" ? "rose" : "orange"
          }
        end

        @today_reminders.reject(&:taken?).each do |reminder|
          items << {
            title: reminder.medication_name,
            badge: reminder.scheduled_at.strftime("%H:%M"),
            pill_class: reminder.overdue? ? "rose" : "sky"
          }
        end

        if items.empty?
          items << { title: "Aucune alerte active", badge: "OK", pill_class: "mint" }
        end

        items.first(3).tap do |list|
          while list.length < 3
            list << { title: "Suivi à jour", badge: "OK", pill_class: "mint" }
          end
        end
      end
    end

    def alert_title(alert)
      case alert.alert_type
      when "hypoglycemia" then "Hypoglycémie détectée"
      when "hyperglycemia" then "Hyperglycémie détectée"
      when "medication_overdue" then "Traitement en retard"
      when "medication_missed" then "Traitement manqué"
      else
        "Alerte de santé"
      end
    end

    def browser_notifications_label
      @profile.browser_notifications_enabled? ? "Activées" : "Désactivées"
    end

    def browser_notifications_pill_class
      @profile.browser_notifications_enabled? ? "mint" : "orange"
    end

    def sensor_sync_label
      @dexcom_connection&.revoked_at.blank? && @dexcom_connection.present? ? "Dexcom actif" : "Non connectée"
    end

    def sensor_sync_pill_class
      @dexcom_connection&.revoked_at.blank? && @dexcom_connection.present? ? "sky" : "orange"
    end

    def clinician_name
      clinician_context&.name || "Coordination DiaCare"
    end

    def clinician_subtitle
      count = clinician_patients.count
      "#{count} patient#{'s' if count != 1} suivi#{'s' if count != 1}"
    end

    def clinician_context
      @clinician_context ||= begin
        return @user if @user.clinician?

        assigned_clinician_for(@user) || User.clinicians.order(:id).first
      end
    end

    def clinician_patients_payload
      @clinician_patients_payload ||= clinician_patients.each.map do |patient|
        build_clinician_patient_payload(patient)
      end
    end

    def clinician_conversations_payload
      @clinician_conversations_payload ||= clinician_conversations.map do |conversation|
        build_clinician_conversation_payload(conversation)
      end
    end

    def clinician_appointments_payload
      @clinician_appointments_payload ||= clinician_appointments.map do |appointment|
        build_clinician_appointment_payload(appointment)
      end
    end

    def clinician_patients
      @clinician_patients ||= begin
        return [] unless clinician_context

        patient_ids = []
        patient_ids.concat clinician_context.clinician_conversations_as_clinician.pluck(:patient_id)
        patient_ids.concat clinician_context.clinician_appointments_as_clinician.pluck(:patient_id)
        patient_ids.concat clinician_context.clinical_notes_as_clinician.pluck(:patient_id)
        patient_ids << @user.id if @user.patient?

        User.patients
            .includes(:clinician_patient_profile, :patient_profile, :dexcom_connection, :glucose_readings, :health_alerts, :medication_schedules, :medication_reminders, :journal_entries)
            .where(id: patient_ids.uniq)
            .order(:name)
            .to_a
      end
    end

    def clinician_conversations
      @clinician_conversations ||= if clinician_context
        clinician_context.clinician_conversations_as_clinician
                         .includes(:patient, :clinician_conversation_participants, clinician_messages: :author)
                         .recent_first
                         .to_a
      else
        []
      end
    end

    def clinician_appointments
      @clinician_appointments ||= if clinician_context
        clinician_context.clinician_appointments_as_clinician.includes(:patient).upcoming.limit(4).to_a
      else
        []
      end
    end

    def latest_coordination_note
      @latest_coordination_note ||= clinician_context&.coordination_notes&.active&.recent_first&.first
    end

    def latest_clinical_note_for(patient)
      @latest_clinical_note_for ||= {}
      @latest_clinical_note_for[patient.id] ||= clinician_context&.clinical_notes_as_clinician&.where(patient:)&.recent_first&.first
    end

    def clinician_patient_record_for(user)
      user.clinician_patient_profile
    end

    def assigned_clinician_for(user)
      clinician_ids = []
      clinician_ids.concat ClinicianConversation.where(patient: user).pluck(:clinician_id)
      clinician_ids.concat ClinicianAppointment.where(patient: user).pluck(:clinician_id)
      clinician_ids.concat ClinicalNote.where(patient: user).pluck(:clinician_id)

      User.clinicians.where(id: clinician_ids.uniq).order(:id).first
    end

    def build_clinician_patient_payload(user)
      record = clinician_patient_record_for(user)
      profile = user.patient_profile || user.build_patient_profile
      latest_reading = user.glucose_readings.max_by(&:measured_at)
      active_alerts = user.health_alerts.select { |alert| !alert.resolved? }.sort_by(&:detected_at).reverse
      next_appointment = clinician_appointments.find { |appointment| appointment.patient_id == user.id }
      status = clinician_status_for(user:, latest_reading:, active_alerts:)
      latest_note = latest_clinical_note_for(user)

      {
        id: clinician_patient_id(user),
        serverId: user.id,
        serverPatientRecordId: record&.id,
        name: user.name,
        initials: initials_for(user.name),
        age: record&.age || "N/R",
        sex: record&.sex.presence || "Non renseigné",
        height: record&.height.presence || "Non renseignée",
        weight: record&.weight.presence || "Non renseigné",
        diagnosis: record&.diagnosis.presence || "Suivi diabète",
        device: clinician_device_label_for(user, latest_reading),
        glucose: latest_reading ? "#{latest_reading.value} mg/dL" : "Aucune donnée",
        tir: "#{clinician_time_in_target_for(user, profile)}%",
        hba1c: "À compléter",
        sync: clinician_sync_label_for(user, latest_reading),
        status: status[:code],
        statusLabel: status[:label],
        contact: clinician_contact_for(user, record),
        phone: record&.phone.presence || "Non renseigné",
        email: user.email,
        nextAppointment: next_appointment ? "#{next_appointment.day_label} · #{next_appointment.time_label}" : "À planifier",
        ordonnance: clinician_ordonnance_for(user, record),
        treatment: clinician_treatment_for(user, record),
        clinicalNoteId: latest_note&.id,
        note: clinician_note_for(user, latest_reading, active_alerts, latest_note),
        alerts: clinician_alerts_for(user, latest_reading, active_alerts),
        carePlan: clinician_care_plan_for(user, latest_reading, active_alerts, next_appointment)
      }
    end

    def build_clinician_conversation_payload(conversation)
      patient = conversation.patient
      participant = conversation.participant_for(clinician_context)
      preview = conversation.last_message_preview.presence || conversation.latest_message&.body.to_s.squish.presence || "Aucun message"
      updated_at = conversation.last_message_at || conversation.updated_at

      {
        id: "conv-#{clinician_patient_id(patient)}",
        serverConversationId: conversation.id,
        serverPatientId: patient.id,
        patientId: clinician_patient_id(patient),
        title: patient.name,
        role: "Patient",
        preview: preview,
        updatedAt: updated_at.strftime("%H:%M"),
        unread: participant&.unread_count.to_i,
        statusTone: participant&.unread_count.to_i.positive? ? "amber" : "blue",
        statusLabel: participant&.unread_count.to_i.positive? ? "À traiter" : "Suivi normal",
        messages: conversation.clinician_messages.chronological.map do |message|
          {
            author: message.author.name,
            role: message.author_role_label,
            text: message.body,
            time: message.sent_at.strftime("%H:%M"),
            mine: message.author_id == clinician_context.id
          }
        end
      }
    end

    def build_clinician_appointment_payload(appointment)
      {
        id: "rdv-#{clinician_patient_id(appointment.patient)}-#{appointment.id}",
        serverAppointmentId: appointment.id,
        patientId: clinician_patient_id(appointment.patient),
        patientName: appointment.patient.name,
        time: appointment.time_label,
        day: appointment.day_label,
        type: appointment.mockup_type_label,
        reason: appointment.reason,
        statusTone: appointment.status_tone,
        statusLabel: appointment.mockup_status_label
      }
    end

    def clinician_patient_id(user)
      user.name.to_s.parameterize.presence || "patient-#{user.id}"
    end

    def initials_for(name)
      parts = name.to_s.split.reject(&:blank?)
      parts.first(2).map { |part| part[0] }.join.upcase.presence || "PT"
    end

    def clinician_device_label_for(user, latest_reading)
      return "Dexcom" if user.dexcom_connection.present? || latest_reading&.source == "dexcom"
      return "Lectures manuelles" if latest_reading.present?

      "Aucun capteur déclaré"
    end

    def clinician_time_in_target_for(user, profile)
      readings = user.glucose_readings.where(measured_at: @range)
      return 0 if readings.empty?

      ((readings.count { |reading| reading.in_target_range?(profile) }.to_f / readings.size) * 100).round
    end

    def clinician_sync_label_for(user, latest_reading)
      if user.dexcom_connection&.last_synced_at.present?
        "Synchronisé il y a #{time_ago_in_words(user.dexcom_connection.last_synced_at)}"
      elsif latest_reading.present?
        "Dernière activité il y a #{time_ago_in_words(latest_reading.measured_at)}"
      else
        "Aucune donnée récente"
      end
    end

    def clinician_status_for(user:, latest_reading:, active_alerts:)
      return { code: "priority", label: "Priorité" } if active_alerts.any? { |alert| alert.severity == "critical" }

      profile = user.patient_profile || user.build_patient_profile
      if latest_reading.present? && !latest_reading.in_target_range?(profile)
        return { code: "surveillance", label: "Surveillance" }
      end

      return { code: "surveillance", label: "Surveillance" } if active_alerts.any?

      { code: "stable", label: "Stable" }
    end

    def clinician_ordonnance_for(user, record = clinician_patient_record_for(user))
      return record.ordonnance if record&.ordonnance.present?

      treatment = clinician_treatment_for(user, record)
      treatment == "Aucun traitement planifié" ? "À préparer" : treatment
    end

    def clinician_contact_for(user, record = clinician_patient_record_for(user))
      return record.contact if record&.contact.present?

      "Contact principal · #{user.email}"
    end

    def clinician_treatment_for(user, record = clinician_patient_record_for(user))
      return record.treatment if record&.treatment.present?

      names = user.medication_schedules.order(:medication_name).limit(2).map(&:medication_name)
      names = user.medication_reminders.order(:scheduled_at).map(&:medication_name).uniq.first(2) if names.empty?
      names.any? ? names.join(" + ") : "Aucun traitement planifié"
    end

    def clinician_note_for(user, latest_reading, active_alerts, latest_note)
      return latest_note.body if latest_note.present?
      return active_alerts.first.message if active_alerts.any?

      latest_journal = user.journal_entries.max_by(&:recorded_at)
      return latest_journal.notes if latest_journal&.notes.present?
      return "Dernière glycémie relevée à #{latest_reading.value} mg/dL." if latest_reading

      "Suivi à initialiser dans le tableau clinique."
    end

    def clinician_alerts_for(user, latest_reading, active_alerts)
      items = active_alerts.first(3).map(&:message)
      items << "Dernière glycémie #{latest_reading.value} mg/dL" if latest_reading && items.length < 3
      items << "Traitements actifs: #{user.medication_schedules.active.count}" if items.length < 3
      items << "Profil à compléter" if items.length < 3
      items.first(3)
    end

    def clinician_care_plan_for(user, latest_reading, active_alerts, next_appointment)
      actions = []
      actions << "Revoir les alertes actives et confirmer la conduite à tenir" if active_alerts.any?
      actions << "Contrôler la tendance glycémique récente" if latest_reading.present?
      actions << "Mettre à jour le plan de traitement" if user.medication_schedules.any?
      actions << "Préparer le prochain rendez-vous du patient" if next_appointment.present?
      actions << "Planifier un point de suivi avec le patient" if actions.length < 3
      actions << "Compléter les informations cliniques manquantes" if actions.length < 3
      actions.first(3)
    end

    def clinician_tone_for_status(status)
      case status
      when "priority" then "rose"
      when "surveillance" then "amber"
      else "teal"
      end
    end

    def seeded_clinician_state_script
      coordination_body = latest_coordination_note&.body.to_s
      patient_notes = clinician_patients.index_with { |patient| latest_clinical_note_for(patient)&.body.to_s }
      important_data = clinician_patients.index_with do |patient|
        record = clinician_patient_record_for(patient)
        {
          treatment: clinician_treatment_for(patient, record),
          ordonnance: clinician_ordonnance_for(patient, record),
          phone: record&.phone.presence || "Non renseigné",
          email: patient.email,
          contact: clinician_contact_for(patient, record)
        }
      end.transform_keys { |patient| clinician_patient_id(patient) }

      # La maquette historique relit une partie de son etat depuis localStorage,
      # donc on l'initialise ici a partir des donnees Rails persistantes.
      <<~JAVASCRIPT
            const persistedCoordinationNote = #{coordination_body.to_json};
            if (persistedCoordinationNote) {
              localStorage.setItem("diacare_coordination_note_v1", persistedCoordinationNote);
            }
            const persistedPatientNotes = #{patient_notes.transform_keys { |patient| clinician_patient_id(patient) }.to_json};
            Object.entries(persistedPatientNotes).forEach(([patientId, value]) => {
              if (value) localStorage.setItem(`diacare_patient_note_${patientId}_v1`, value);
            });
            const persistedImportantData = #{important_data.to_json};
            Object.entries(persistedImportantData).forEach(([patientId, value]) => {
              localStorage.setItem(`diacare_important_${patientId}_v1`, JSON.stringify(value));
            });

      JAVASCRIPT
    end

    def clinician_api_config
      {
        enabled: @user.clinician?,
        csrfToken: @csrf_token,
        conversationsPath: "/clinician/conversations",
        conversationPathTemplate: "/clinician/conversations/__ID__",
        conversationMessagesPathTemplate: "/clinician/conversations/__ID__/messages",
        conversationMarkReadPathTemplate: "/clinician/conversations/__ID__/mark_read",
        clinicalNotesPath: "/clinician/clinical_notes",
        patientRecordsPath: "/clinician/patient_records",
        patientRecordPathTemplate: "/clinician/patient_records/__ID__",
        coordinationNotePath: "/clinician/coordination_note",
        coordinationNoteId: latest_coordination_note&.id
      }
    end

    def clinician_persistence_bridge_script
      # Ces wrappers conservent le comportement visuel de la maquette tout en
      # redirigeant les actions d'ecriture vers les endpoints JSON Rails.
      <<~JAVASCRIPT
            const clinicianApi = #{clinician_api_config.to_json};

            const replacePathId = (template, id) => String(template || "").replace("__ID__", String(id));
            const clinicianHeaders = () => ({
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-CSRF-Token": clinicianApi.csrfToken || ""
            });

            const mapConversationFromServer = (payload) => {
              const patient = Array.isArray(patients) ? patients.find((item) => Number(item.serverId) === Number(payload.patient_id)) : null;
              return {
                id: `conv-${patient ? patient.id : payload.patient_id}`,
                serverConversationId: payload.id,
                serverPatientId: payload.patient_id,
                patientId: patient ? patient.id : String(payload.patient_id),
                title: payload.patient_name,
                role: "Patient",
                preview: payload.last_message_preview || "Aucun message",
                updatedAt: payload.last_message_at ? new Date(payload.last_message_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "Maintenant",
                unread: Number(payload.unread_count || 0),
                statusTone: Number(payload.unread_count || 0) > 0 ? "amber" : "blue",
                statusLabel: Number(payload.unread_count || 0) > 0 ? "À traiter" : "Suivi normal",
                messages: Array.isArray(payload.messages)
                  ? payload.messages.map((message) => ({
                      author: message.author_name,
                      role: message.author_role,
                      text: message.body,
                      time: new Date(message.sent_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
                      mine: message.author_role === "Clinicien"
                    }))
                  : []
              };
            };

            const upsertConversation = (conversation) => {
              if (!conversation) return;
              const index = conversations.findIndex((item) => item.id === conversation.id || Number(item.serverConversationId) === Number(conversation.serverConversationId));
              if (index >= 0) {
                conversations[index] = { ...conversations[index], ...conversation };
              } else {
                conversations.unshift(conversation);
              }
            };

            const findConversationByPatientId = (patientId) =>
              Array.isArray(conversations) ? conversations.find((item) => item.patientId === patientId) : null;

            const ensureServerConversation = async (patientId, options = {}) => {
              const patient = patientMap.get(patientId);
              if (!patient) return null;

              const existing = findConversationByPatientId(patientId);
              if (existing && existing.serverConversationId) return existing;

              const response = await fetch(clinicianApi.conversationsPath, {
                method: "POST",
                headers: clinicianHeaders(),
                credentials: "same-origin",
                body: JSON.stringify({
                  clinician_conversation: {
                    patient_id: patient.serverId,
                    subject: `Suivi ${patient.name}`
                  },
                  initial_message_body: options.initialMessageBody || null
                })
              });

              if (!response.ok) throw new Error("conversation_create_failed");

              const payload = await response.json();
              const createdConversation = mapConversationFromServer(payload);
              upsertConversation(createdConversation);
              return createdConversation;
            };

            const persistMessage = async (conversation, text) => {
              const response = await fetch(replacePathId(clinicianApi.conversationMessagesPathTemplate, conversation.serverConversationId), {
                method: "POST",
                headers: clinicianHeaders(),
                credentials: "same-origin",
                body: JSON.stringify({ clinician_message: { body: text } })
              });

              if (!response.ok) throw new Error("message_create_failed");

              const payload = await response.json();
              const time = new Date(payload.sent_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
              conversation.messages.push({
                author: payload.author_name,
                role: payload.author_role,
                text: payload.body,
                time,
                mine: true
              });
              conversation.preview = String(payload.body || "").split("\\n")[0];
              conversation.updatedAt = time;
              conversation.unread = 0;
              conversation.statusTone = "blue";
              conversation.statusLabel = "Réponse envoyée";
              return conversation;
            };

            const persistPatientNote = async (patientId, value) => {
              const patient = patientMap.get(patientId);
              if (!patient) return;
              const isUpdate = Boolean(patient.clinicalNoteId);
              const url = isUpdate ? replacePathId(`${clinicianApi.clinicalNotesPath}/__ID__`, patient.clinicalNoteId) : clinicianApi.clinicalNotesPath;
              const response = await fetch(url, {
                method: isUpdate ? "PATCH" : "POST",
                headers: clinicianHeaders(),
                credentials: "same-origin",
                body: JSON.stringify({
                  clinical_note: {
                    patient_id: patient.serverId,
                    title: "Note clinique",
                    body: value,
                    category: "follow_up",
                    pinned: false,
                    recorded_at: new Date().toISOString()
                  }
                })
              });

              if (!response.ok) throw new Error("clinical_note_save_failed");

              const payload = await response.json();
              patient.clinicalNoteId = payload.id;
              patient.note = payload.body;
              localStorage.setItem(`diacare_patient_note_${patientId}_v1`, payload.body);
            };

            const persistCoordinationNote = async (value) => {
              const hasExisting = Boolean(clinicianApi.coordinationNoteId);
              const response = await fetch(clinicianApi.coordinationNotePath, {
                method: hasExisting ? "PATCH" : "POST",
                headers: clinicianHeaders(),
                credentials: "same-origin",
                body: JSON.stringify({
                  coordination_note: {
                    title: "Note de coordination",
                    body: value,
                    active: true
                  }
                })
              });

              if (!response.ok) throw new Error("coordination_note_save_failed");

              const payload = await response.json();
              clinicianApi.coordinationNoteId = payload.id;
              localStorage.setItem("diacare_coordination_note_v1", payload.body || value);
              return payload;
            };

            const persistPatientRecord = async (patientId, attributes) => {
              const patient = patientMap.get(patientId);
              if (!patient) return null;

              const hasExisting = Boolean(patient.serverPatientRecordId);
              const url = hasExisting
                ? replacePathId(clinicianApi.patientRecordPathTemplate, patient.serverPatientRecordId)
                : clinicianApi.patientRecordsPath;

              const response = await fetch(url, {
                method: hasExisting ? "PATCH" : "POST",
                headers: clinicianHeaders(),
                credentials: "same-origin",
                body: JSON.stringify({
                  patient_record: {
                    patient_id: patient.serverId,
                    ...attributes
                  }
                })
              });

              if (!response.ok) throw new Error("patient_record_save_failed");

              const payload = await response.json();
              patient.serverPatientRecordId = payload.id;
              patient.name = payload.name;
              patient.email = payload.email;
              patient.sex = payload.sex || "Non renseigné";
              patient.age = payload.age ?? "N/R";
              patient.height = payload.height || "Non renseignée";
              patient.weight = payload.weight || "Non renseigné";
              patient.diagnosis = payload.diagnosis || "Suivi diabète";
              patient.treatment = payload.treatment || "Aucun traitement planifié";
              patient.ordonnance = payload.ordonnance || "À préparer";
              patient.phone = payload.phone || "Non renseigné";
              patient.contact = payload.contact || `Contact principal · ${payload.email}`;
              patient.initials = initialsFromName(payload.name);

              const importantData = {
                treatment: patient.treatment,
                ordonnance: patient.ordonnance,
                phone: patient.phone,
                email: patient.email,
                contact: patient.contact
              };
              localStorage.setItem(`diacare_important_${patientId}_v1`, JSON.stringify(importantData));
              return payload;
            };

            if (clinicianApi.enabled) {
              const originalOpenConversation = openConversation;
              openConversation = function(conversationId, options = {}) {
                const result = originalOpenConversation(conversationId, options);
                const conversation = conversations.find((item) => item.id === conversationId);
                if (conversation && conversation.serverConversationId) {
                  fetch(replacePathId(clinicianApi.conversationMarkReadPathTemplate, conversation.serverConversationId), {
                    method: "PATCH",
                    headers: clinicianHeaders(),
                    credentials: "same-origin"
                  }).catch(() => {});
                }
                return result;
              };

              openConversationForPatient = async function(patientId) {
                const patient = patientMap.get(patientId);
                if (!patient) return;

                const existing = findConversationByPatientId(patientId);
                if (existing) {
                  openConversation(existing.id);
                  if (threadInput) threadInput.focus();
                  showToast(`Conversation ouverte avec ${patient.name}.`);
                  return;
                }

                try {
                  const conversation = await ensureServerConversation(patientId, {
                    initialMessageBody: `Bonjour ${patient.name}, je vous contacte depuis votre fiche patient.`
                  });
                  updateMessageCounters();
                  openConversation(conversation.id);
                  if (threadInput) threadInput.focus();
                  showToast(`Nouvelle conversation créée avec ${patient.name}.`);
                } catch {
                  showToast("Impossible de créer la conversation pour le moment.");
                }
              };

              handleSendOrdonnance = async function(patientId) {
                const patient = patientMap.get(patientId);
                if (!patient) return;

                try {
                  const conversation = await ensureServerConversation(patientId);
                  await persistMessage(conversation, `Ordonnance envoyée: ${patient.ordonnance}.`);
                  renderConversationList();
                  if (state.activeConversationId === conversation.id) renderThread();
                  updateMessageCounters();
                  showToast(`Ordonnance envoyée à ${patient.name}.`);
                } catch {
                  showToast("Impossible d'envoyer l'ordonnance pour le moment.");
                }
              };

              if (threadForm) {
                threadForm.addEventListener(
                  "submit",
                  async (event) => {
                    event.preventDefault();
                    event.stopImmediatePropagation();

                    const message = threadInput ? threadInput.value.trim() : "";
                    const attachments = Array.isArray(threadAttachmentNames) ? threadAttachmentNames : [];
                    if (!message && !attachments.length) return;

                    let conversation = conversations.find((item) => item.id === state.activeConversationId);
                    if (!conversation) return;

                    let finalText = message;
                    if (attachments.length) {
                      const attachLine = `Pièce(s) jointe(s) : ${attachments.join(", ")}`;
                      finalText = finalText ? `${finalText}\\n\\n${attachLine}` : attachLine;
                    }

                    try {
                      if (!conversation.serverConversationId) {
                        conversation = await ensureServerConversation(conversation.patientId);
                        state.activeConversationId = conversation.id;
                      }

                      await persistMessage(conversation, finalText);
                      if (threadInput) threadInput.value = "";
                      threadAttachmentNames = [];
                      selectedThreadFileNames = [];
                      if (threadFileInput) threadFileInput.value = "";
                      renderConversationList();
                      renderThread();
                      updateMessageCounters();
                      showToast("Message envoyé.");
                    } catch {
                      showToast("Impossible d'envoyer le message pour le moment.");
                    }
                  },
                  true
                );
              }

              if (noteModalSave) {
                noteModalSave.addEventListener(
                  "click",
                  async (event) => {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    if (!noteModalText) return;

                    try {
                      if (activeNoteContext?.type === "patientNote") {
                        await persistPatientNote(activeNoteContext.patientId, noteModalText.value);
                        renderPatientDetail();
                        showToast("Note mise à jour.");
                      } else {
                        await persistCoordinationNote(noteModalText.value);
                        syncNotePreview();
                        showToast("Note enregistrée.");
                      }
                      closeNoteModal();
                    } catch {
                      showToast("Impossible d'enregistrer la note pour le moment.");
                    }
                  },
                  true
                );
              }

              if (importantModalSave) {
                importantModalSave.addEventListener(
                  "click",
                  async (event) => {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    if (!activeImportantPatientId) return;

                    try {
                      await persistPatientRecord(activeImportantPatientId, {
                        name: patientMap.get(activeImportantPatientId)?.name,
                        email: importantEmail ? importantEmail.value : patientMap.get(activeImportantPatientId)?.email,
                        treatment: importantTreatment ? importantTreatment.value : "",
                        ordonnance: importantOrdonnance ? importantOrdonnance.value : "",
                        phone: importantPhone ? importantPhone.value : "",
                        contact: importantContact ? importantContact.value : ""
                      });
                      renderPatientDetail();
                      renderPatientList();
                      showToast("Données importantes mises à jour.");
                      closeImportantModal();
                    } catch {
                      showToast("Impossible d'enregistrer les données importantes.");
                    }
                  },
                  true
                );
              }

              if (patientEditModalSave) {
                patientEditModalSave.addEventListener(
                  "click",
                  async (event) => {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    if (!activePatientEditId) return;

                    const patient = patientMap.get(activePatientEditId);
                    if (!patient) return;

                    const prenom = patientEditPrenom ? String(patientEditPrenom.value || "").trim() : "";
                    const nom = patientEditNom ? String(patientEditNom.value || "").trim() : "";
                    const fullName = [prenom, nom].filter(Boolean).join(" ").trim() || patient.name;

                    try {
                      await persistPatientRecord(activePatientEditId, {
                        name: fullName,
                        email: patientEditEmail ? patientEditEmail.value : patient.email,
                        sex: patientEditSex ? patientEditSex.value : "",
                        age: patientEditAge && patientEditAge.value !== "" ? Number(patientEditAge.value) : null,
                        height: patientEditHeight ? patientEditHeight.value : "",
                        weight: patientEditWeight ? patientEditWeight.value : "",
                        diagnosis: patientEditDiagnosis ? patientEditDiagnosis.value : "",
                        treatment: patientEditTreatment ? patientEditTreatment.value : "",
                        ordonnance: patientEditOrdonnance ? patientEditOrdonnance.value : "",
                        phone: patientEditPhone ? patientEditPhone.value : "",
                        contact: patientEditContact ? patientEditContact.value : ""
                      });

                      conversations.forEach((conversation) => {
                        if (conversation.patientId === activePatientEditId) conversation.title = patient.name;
                      });
                      appointments.forEach((appointment) => {
                        if (appointment.patientId === activePatientEditId) appointment.patientName = patient.name;
                      });

                      renderPatientDetail();
                      renderPatientList();
                      renderConversationList();
                      renderAppointments();
                      showToast("Fiche patient mise à jour.");
                      closePatientEditModal();
                    } catch {
                      showToast("Impossible d'enregistrer la fiche patient.");
                    }
                  },
                  true
                );
              }
            }

      JAVASCRIPT
    end

  end
end
