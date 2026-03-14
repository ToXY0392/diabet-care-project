import { useState } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Card } from "../components/Card";
import { HeaderPill } from "../components/HeaderPill";
import { SectionTitle } from "../components/SectionTitle";
import { historyRows, patient } from "../data/mockData";
import { colors, radius, spacing } from "../theme";
import type { FollowUpView } from "../types";

type MeasuresScreenProps = {
	onProfilePress?: () => void;
	onAddMeal?: () => void;
};

export function MeasuresScreen({
	onProfilePress,
	onAddMeal,
}: MeasuresScreenProps) {
	const [view, setView] = useState<FollowUpView>("jour");

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.content}>
			<HeaderPill
				dateLabel="Mercredi 11 mars"
				initials={patient.initials}
				onProfilePress={onProfilePress}
			/>

			<View style={styles.tabs}>
				{(["jour", "tendances", "carnet"] as const).map((v) => (
					<TouchableOpacity
						key={v}
						style={[styles.tab, view === v && styles.tabActive]}
						onPress={() => setView(v)}
						activeOpacity={0.8}
					>
						<Text style={[styles.tabText, view === v && styles.tabTextActive]}>
							{v === "jour"
								? "Jour"
								: v === "tendances"
									? "Tendances"
									: "Carnet"}
						</Text>
					</TouchableOpacity>
				))}
			</View>

			<SectionTitle
				title="Suivi"
				subtitle="Vue clinique journalière et indicateurs clés"
			/>

			{view === "jour" && (
				<>
					<View style={styles.statsRow}>
						<View style={styles.statBox}>
							<Text style={styles.statValue}>{patient.lastReading}</Text>
							<Text style={styles.statUnit}>mg/dL</Text>
							<Text style={styles.statLabel}>Glycémie moy.</Text>
						</View>
						<View style={styles.statBox}>
							<Text style={styles.statValue}>6.5</Text>
							<Text style={styles.statUnit}>u</Text>
							<Text style={styles.statLabel}>Basal total</Text>
						</View>
					</View>

					<Card style={styles.card}>
						<Text style={styles.cardTitle}>Temps dans la cible</Text>
						<View style={styles.tirBar}>
							<View style={[styles.tirFill, { width: `${patient.tir}%` }]} />
						</View>
						<Text style={styles.tirLabel}>{patient.tir}% dans la cible</Text>
					</Card>

					<Card style={styles.card}>
						<Text style={styles.cardTitle}>Glycémies</Text>
						<View style={styles.chartPlaceholder}>
							<Text style={styles.chartHint}>Courbe glycémique</Text>
						</View>
						<TouchableOpacity
							style={styles.addBtn}
							onPress={onAddMeal}
							activeOpacity={0.8}
						>
							<Text style={styles.addBtnText}>+ Ajouter un repas</Text>
						</TouchableOpacity>
					</Card>

					<Card style={styles.card}>
						<Text style={styles.cardTitle}>Historique des mesures</Text>
						{historyRows.slice(0, 3).map((row) => (
							<View key={`${row.time}-${row.value}`} style={styles.historyRow}>
								<Text style={styles.historyTime}>{row.time}</Text>
								<Text style={styles.historyValue}>{row.value}</Text>
								<Text style={styles.historyStatus}>{row.status}</Text>
							</View>
						))}
					</Card>
				</>
			)}

			{view !== "jour" && (
				<Card style={styles.card}>
					<Text style={styles.cardTitle}>
						{view === "tendances" ? "Tendances" : "Carnet"}
					</Text>
					<Text style={styles.placeholderText}>Vue à venir</Text>
				</Card>
			)}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: colors.bg },
	content: { padding: spacing.lg, paddingBottom: 100 },
	tabs: {
		flexDirection: "row",
		backgroundColor: colors.surfaceAlt,
		borderRadius: radius.full,
		padding: 4,
		marginBottom: 16,
	},
	tab: {
		flex: 1,
		paddingVertical: 10,
		alignItems: "center",
		borderRadius: radius.full,
	},
	tabActive: { backgroundColor: colors.teal },
	tabText: { fontSize: 13, fontWeight: "600", color: colors.textSecondary },
	tabTextActive: { color: colors.onTeal },
	statsRow: { flexDirection: "row", gap: 16, marginBottom: 16 },
	statBox: {
		flex: 1,
		backgroundColor: colors.teal,
		borderRadius: radius.lg,
		padding: 16,
	},
	statValue: { fontSize: 24, fontWeight: "bold", color: colors.onTeal },
	statUnit: { fontSize: 14, color: colors.onTeal, opacity: 0.9 },
	statLabel: { fontSize: 12, color: colors.onTeal, opacity: 0.9, marginTop: 4 },
	card: { marginBottom: 16 },
	cardTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.text,
		marginBottom: 12,
	},
	tirBar: {
		height: 24,
		backgroundColor: colors.mint,
		borderRadius: 12,
		overflow: "hidden",
	},
	tirFill: {
		height: "100%",
		backgroundColor: colors.success,
		borderRadius: 12,
	},
	tirLabel: { fontSize: 14, color: colors.textSecondary, marginTop: 8 },
	chartPlaceholder: {
		height: 120,
		backgroundColor: colors.surfaceAlt,
		borderRadius: radius.md,
		alignItems: "center",
		justifyContent: "center",
	},
	chartHint: { fontSize: 12, color: colors.muted },
	addBtn: {
		marginTop: 12,
		paddingVertical: 10,
		alignItems: "center",
	},
	addBtnText: { fontSize: 14, fontWeight: "600", color: colors.teal },
	historyRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	historyTime: { width: 50, fontSize: 13, color: colors.text },
	historyValue: {
		width: 50,
		fontSize: 13,
		fontWeight: "600",
		color: colors.text,
	},
	historyStatus: { flex: 1, fontSize: 12, color: colors.textSecondary },
	placeholderText: { fontSize: 14, color: colors.muted },
});
