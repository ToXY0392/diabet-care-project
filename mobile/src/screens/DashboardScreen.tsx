import { useNavigation } from "@react-navigation/native";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Badge } from "../components/Badge";
import { Card } from "../components/Card";
import { HeaderPill } from "../components/HeaderPill";
import { SectionTitle } from "../components/SectionTitle";
import { patient, patientThreads } from "../data/mockData";
import { colors, radius, spacing } from "../theme";

const priorityThread =
	patientThreads.find((t) => t.unread > 0) ?? patientThreads[0];
const unreadTotal = patientThreads.reduce((s, t) => s + t.unread, 0);

type DashboardScreenProps = {
	onAddMeal?: () => void;
	onProfilePress?: () => void;
};

export function DashboardScreen({
	onAddMeal,
	onProfilePress,
}: DashboardScreenProps) {
	const navigation = useNavigation();
	const openChat = () => {
		(
			navigation.getParent() as {
				navigate: (
					name: string,
					params: { thread: typeof priorityThread },
				) => void;
			}
		)?.navigate("Chat", { thread: priorityThread });
	};
	const goToExchanges = () => {
		(navigation as { navigate: (name: string) => void }).navigate("Exchanges");
	};
	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.content}>
			<HeaderPill
				dateLabel="Mercredi 11 mars"
				initials={patient.initials}
				onProfilePress={onProfilePress}
			/>
			<SectionTitle
				title="Tableau de bord"
				subtitle="Vue complète du suivi CGM et des actions rapides"
			/>

			<Card variant="hero" style={styles.heroCard}>
				<Text style={styles.heroLabel}>CAPTEUR PRINCIPAL</Text>
				<Text style={styles.heroSensor}>{patient.sensor}</Text>
				<Text style={styles.heroValue}>{patient.lastReading}</Text>
				<Text style={styles.heroUnit}>mg/dL</Text>
				<Text style={styles.heroSync}>Stable · sync {patient.syncAgo}</Text>
			</Card>

			<TouchableOpacity
				style={styles.addMealBtn}
				onPress={onAddMeal}
				activeOpacity={0.85}
			>
				<Text style={styles.addMealText}>Ajouter repas</Text>
			</TouchableOpacity>

			<Card variant="hero" style={styles.messagesCard}>
				<View style={styles.messagesHeader}>
					<Text style={styles.messagesTitle}>Messages non lus</Text>
					{unreadTotal > 0 && (
						<Badge
							label={`${unreadTotal} non lu${unreadTotal > 1 ? "s" : ""}`}
							tone="info"
						/>
					)}
				</View>
				<View style={styles.threadPreview}>
					<Text style={styles.threadName}>{priorityThread.name}</Text>
					<Text style={styles.threadText} numberOfLines={1}>
						{priorityThread.preview}
					</Text>
					<Text style={styles.threadTime}>{priorityThread.time}</Text>
				</View>
				<View style={styles.actionsRow}>
					<TouchableOpacity
						style={styles.actionBtn}
						onPress={openChat}
						activeOpacity={0.8}
					>
						<Text style={styles.actionBtnText}>Ouvrir</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.actionBtn}
						onPress={goToExchanges}
						activeOpacity={0.8}
					>
						<Text style={styles.actionBtnText}>Voir tout</Text>
					</TouchableOpacity>
				</View>
			</Card>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: colors.bg },
	content: { padding: spacing.lg, paddingBottom: 100 },
	heroCard: { marginBottom: spacing.xl },
	heroLabel: {
		fontSize: 11,
		letterSpacing: 2,
		color: colors.onTeal,
		opacity: 0.9,
		marginBottom: 4,
	},
	heroSensor: {
		fontSize: 20,
		fontWeight: "600",
		color: colors.onTeal,
		marginBottom: 8,
	},
	heroValue: { fontSize: 56, fontWeight: "bold", color: colors.onTeal },
	heroUnit: { fontSize: 18, color: colors.onTeal, marginTop: -4 },
	heroSync: { fontSize: 14, color: colors.onTeal, opacity: 0.9, marginTop: 4 },
	addMealBtn: {
		alignSelf: "center",
		backgroundColor: colors.teal,
		paddingVertical: 14,
		paddingHorizontal: 32,
		borderRadius: radius.full,
		marginBottom: spacing.xl,
	},
	addMealText: { fontSize: 15, fontWeight: "600", color: colors.onTeal },
	messagesCard: {},
	messagesHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginBottom: 12,
	},
	messagesTitle: {
		fontSize: 11,
		letterSpacing: 2,
		color: colors.onTeal,
		fontWeight: "600",
	},
	threadPreview: {
		backgroundColor: colors.mint,
		borderRadius: radius.lg,
		padding: 12,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.2)",
	},
	threadName: { fontSize: 16, fontWeight: "600", color: colors.text },
	threadText: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
	threadTime: {
		fontSize: 12,
		color: colors.textSecondary,
		position: "absolute",
		top: 12,
		right: 12,
	},
	actionsRow: { flexDirection: "row", gap: 12 },
	actionBtn: {
		flex: 1,
		backgroundColor: colors.mint,
		paddingVertical: 10,
		borderRadius: radius.sm,
		alignItems: "center",
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.2)",
	},
	actionBtnText: { fontSize: 13, fontWeight: "600", color: colors.teal },
});
