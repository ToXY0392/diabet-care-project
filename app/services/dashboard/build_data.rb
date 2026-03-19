module Dashboard
  class BuildData
    # Construit tous les agregats necessaires au dashboard patient sur une fenetre donnee.
    WINDOWS = [7, 14, 30].freeze
    DAYPARTS = {
      "Matin" => 5...11,
      "Midi" => 11...15,
      "Apres-midi" => 15...19,
      "Soir" => 19...24,
      "Nuit" => 0...5
    }.freeze

    def self.call(user:, window:)
      new(user:, window:).call
    end

    def initialize(user:, window:)
      @user = user
      @window = WINDOWS.include?(window.to_i) ? window.to_i : 7
      @profile = user.patient_profile || user.create_patient_profile!
      @range = (@window - 1).days.ago.beginning_of_day..Time.zone.now
    end

    def call
      MedicationSchedules::SyncWindow.call(user: @user, from: Date.current - 7.days, to: Date.current + 14.days)
      evaluate_medication_alerts

      readings = @user.glucose_readings.where(measured_at: @range).recent_first
      latest_reading = readings.first
      today_readings = @user.glucose_readings.for_today.order(measured_at: :asc)
      today_meals = @user.meals.for_today.order(eaten_at: :asc)
      today_reminders = @user.medication_reminders.due_today.order(:scheduled_at)
      today_journal_entries = @user.journal_entries.where(recorded_at: Time.zone.today.all_day).order(:recorded_at)
      recent_alerts = @user.health_alerts.active.unread.recent_first.limit(5)
      meal_response_stats = build_meal_response_stats
      series = build_series(readings)
      treatment_stats = build_treatment_stats

      {
        window: @window,
        range: @range,
        patient_name: @user.name,
        patient_profile: @profile,
        recent_alerts: recent_alerts,
        summary_cards: build_summary_cards(readings, today_readings, today_meals, today_reminders, recent_alerts, latest_reading, treatment_stats),
        today_timeline: build_today_timeline(today_readings, today_meals, today_reminders, today_journal_entries),
        insights: build_insights(readings, latest_reading, today_meals, recent_alerts, meal_response_stats, treatment_stats, today_journal_entries),
        meal_response_stats: meal_response_stats,
        series: series,
        chart_max_value: [series.map { |point| point[:average] }.compact.max.to_i, @profile.glucose_target_high].max,
        average_glucose: readings.average(:value)&.round.to_i,
        latest_meal: today_meals.last,
        today_reminders: today_reminders,
        taken_reminders_count: today_reminders.count(&:taken?),
        daypart_averages: build_daypart_averages(readings),
        treatment_stats: treatment_stats,
        journal_snapshot: @user.journal_entries.where(recorded_at: @range).order(recorded_at: :desc).limit(4),
        symptom_correlation: build_symptom_correlation,
        recent_journal_count: @user.journal_entries.where(recorded_at: @range).count
      }
    end

    private

    def evaluate_medication_alerts
      @user.medication_reminders.where(scheduled_at: 2.days.ago.beginning_of_day..Time.zone.now).find_each do |reminder|
        HealthAlerts::EvaluateMedicationReminder.call(reminder)
      end
    end

    def build_summary_cards(readings, today_readings, today_meals, today_reminders, alerts, latest_reading, treatment_stats)
      average = readings.average(:value)&.round || 0
      in_target_percent = if readings.any?
        ((readings.count { |reading| reading.in_target_range?(@profile) }.to_f / readings.size) * 100).round
      else
        0
      end

      [
        { label: "Glycemie moyenne", value: "#{average} mg/dL", trend: "#{readings.size} mesures sur #{@window} jours", tone: tone_for_average(average) },
        { label: "Temps dans la cible", value: "#{in_target_percent}%", trend: "Objectif #{@profile.glucose_target_low}-#{@profile.glucose_target_high} mg/dL", tone: in_target_percent >= 70 ? "good" : "warn" },
        { label: "Derniere mesure", value: latest_reading ? "#{latest_reading.value} mg/dL" : "Aucune", trend: latest_reading ? latest_reading.context_label : "Ajoutez une premiere mesure", tone: latest_reading&.in_target_range?(@profile) ? "good" : "neutral" },
        { label: "Mesures aujourd'hui", value: today_readings.size.to_s, trend: "Suivi quotidien en cours", tone: today_readings.any? ? "good" : "warn" },
        { label: "Repas aujourd'hui", value: today_meals.size.to_s, trend: "#{today_meals.sum(&:carbs)} g glucides", tone: today_meals.any? ? "good" : "neutral" },
        { label: "Observance traitement", value: "#{treatment_stats[:adherence_rate]}%", trend: "#{treatment_stats[:taken_count]}/#{treatment_stats[:total_count]} prises sur #{@window} jours", tone: treatment_stats[:adherence_rate] >= 80 ? "good" : "warn" },
        { label: "Alertes actives", value: alerts.count.to_s, trend: alerts.any? ? alerts.first.message : "Aucune alerte active", tone: alerts.any? ? "warn" : "good" }
      ]
    end

    def build_today_timeline(today_readings, today_meals, today_reminders, today_journal_entries)
      events = []

      events += today_readings.map do |reading|
        { time: reading.measured_at.strftime("%H:%M"), title: reading.context_label, detail: "#{reading.value} mg/dL#{reading.notes.present? ? " - #{reading.notes}" : ""}", kind: "reading" }
      end

      events += today_meals.map do |meal|
        { time: meal.eaten_at.strftime("%H:%M"), title: meal.name, detail: "#{meal.carbs} g glucides#{meal.notes.present? ? " - #{meal.notes}" : ""}", kind: "meal" }
      end

      events += today_reminders.map do |reminder|
        { time: reminder.scheduled_at.strftime("%H:%M"), title: reminder.medication_name, detail: "#{reminder.dosage} - #{reminder.status_label.downcase}", kind: "reminder" }
      end

      events += today_journal_entries.map do |entry|
        { time: entry.recorded_at.strftime("%H:%M"), title: "Journal: #{entry.mood.humanize}", detail: [entry.symptoms.presence, entry.notes.presence].compact.join(" - ").presence || "Activite #{entry.activity_minutes || 0} min", kind: "journal" }
      end

      return [{ time: "--:--", title: "Aucune activite aujourd'hui", detail: "Ajoutez une mesure, un repas, une prise ou une note de journal.", kind: "neutral" }] if events.empty?

      events.sort_by { |item| item[:time] }
    end

    def build_insights(readings, latest_reading, today_meals, alerts, meal_response_stats, treatment_stats, today_journal_entries)
      return ["Aucune mesure n'est encore disponible.", "Commencez par enregistrer quelques valeurs glycemiques.", "Le dashboard s'adaptera automatiquement aux donnees ajoutees."] if readings.empty?

      [
        "La moyenne recente est de #{readings.average(:value)&.round || 0} mg/dL.",
        "La derniere mesure est #{latest_reading.value} mg/dL, prise #{latest_reading.context_label.downcase}.",
        today_meals.any? ? "Les repas du jour representent #{today_meals.sum(&:carbs)} g de glucides." : "Pensez a enregistrer vos repas pour mieux contextualiser les mesures.",
        meal_response_stats[:count].positive? ? "La glycemie evolue en moyenne de #{meal_response_stats[:average_delta]} mg/dL dans les 3 heures suivant un repas." : "Ajoutez des mesures avant et apres repas pour enrichir la comparaison.",
        "Observance traitement: #{treatment_stats[:adherence_rate]}% sur #{@window} jours (#{treatment_stats[:overdue_count]} en retard, #{treatment_stats[:missed_count]} manquees).",
        today_journal_entries.any? ? "#{today_journal_entries.count} entree(s) de journal aujourd'hui pour relier symptomes et glycemie." : "Ajoutez une entree de journal pour suivre humeur, symptomes et activite.",
        alerts.any? ? "#{alerts.count} alerte(s) active(s) necessitent encore votre attention." : "Aucune alerte active actuellement."
      ]
    end

    def build_series(readings)
      grouped = readings.group_by { |reading| reading.measured_at.to_date }

      (@range.begin.to_date..Date.current).map do |date|
        day_readings = grouped.fetch(date, [])
        average = day_readings.any? ? (day_readings.sum(&:value).to_f / day_readings.size).round : nil

        {
          date: date,
          label: I18n.l(date, format: "%d/%m"),
          average: average,
          count: day_readings.size,
          meals_count: @user.meals.where(eaten_at: date.all_day).count
        }
      end
    end

    def build_meal_response_stats
      meals = @user.meals.where(eaten_at: @range).order(eaten_at: :desc)

      paired_meals = meals.filter_map do |meal|
        before_reading = @user.glucose_readings.where(measured_at: (meal.eaten_at - 2.hours)..meal.eaten_at).order(measured_at: :desc).first
        after_reading = @user.glucose_readings.where(measured_at: meal.eaten_at..(meal.eaten_at + 3.hours)).order(:measured_at).first
        next if before_reading.blank? || after_reading.blank?

        { meal: meal, before: before_reading, after: after_reading, delta: after_reading.value - before_reading.value }
      end

      {
        pairs: paired_meals.first(4),
        count: paired_meals.size,
        average_before: average_for_pairs(paired_meals, :before),
        average_after: average_for_pairs(paired_meals, :after),
        average_delta: paired_meals.any? ? (paired_meals.sum { |pair| pair[:delta] }.to_f / paired_meals.size).round : 0
      }
    end

    def build_daypart_averages(readings)
      DAYPARTS.map do |label, hours|
        matches = readings.select { |reading| hours.cover?(reading.measured_at.hour) }
        average = matches.any? ? (matches.sum(&:value).to_f / matches.size).round : nil

        { label: label, average: average, count: matches.count }
      end
    end

    def build_treatment_stats
      reminders = @user.medication_reminders.for_range(@range)
      total_count = reminders.count
      taken_count = reminders.taken.count

      {
        total_count: total_count,
        taken_count: taken_count,
        overdue_count: reminders.select(&:overdue?).count,
        missed_count: reminders.select(&:missed?).count,
        adherence_rate: total_count.positive? ? ((taken_count.to_f / total_count) * 100).round : 0
      }
    end

    def build_symptom_correlation
      entries = @user.journal_entries.where(recorded_at: @range).where.not(symptoms: [nil, ""])
      correlated_readings = entries.filter_map do |entry|
        @user.glucose_readings.where(measured_at: (entry.recorded_at - 2.hours)..(entry.recorded_at + 4.hours)).order(:measured_at).first
      end

      {
        symptomatic_entries: entries.count,
        correlated_readings_count: correlated_readings.count,
        average_glucose: correlated_readings.any? ? (correlated_readings.sum(&:value).to_f / correlated_readings.count).round : 0
      }
    end

    def average_for_pairs(pairs, key)
      return 0 if pairs.empty?

      (pairs.sum { |pair| pair[key].value }.to_f / pairs.size).round
    end

    def tone_for_average(average)
      return "warn" if average.zero?
      return "good" if average.between?(@profile.glucose_target_low, @profile.glucose_target_high)

      "warn"
    end
  end
end
