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
import { patient } from "../data/mockData";
import { colors, radius, spacing } from "../theme";
import type { AccountTab } from "../types";

const PROFILE_SETTINGS = [
	{
		key: "capteur",
		label: "Capteur connecté",
		value: `${patient.sensor} · synchronisé ${patient.syncAgo}`,
	},
	{
		key: "sources",
		label: "Sources de données",
		value: `${patient.source} · télésurveillance active`,
	},
	{
		key: "notif",
		label: "Notifications",
		value: "Alertes hypo, hyper et messages médecin",
	},
	{
		key: "conf",
		label: "Confidentialité",
		value: "Consentement actif et partage des données",
	},
	{
		key: "secu",
		label: "Sécurité",
		value: "Accès au compte et protection des données",
	},
];

const PARAM_ITEMS = [
	"Notifications",
	"Historique de synchronisation",
	"Documents partagés",
	"Sécurité du compte",
];

type ProfileScreenProps = {
	onProfilePress?: () => void;
};

export function ProfileScreen({ onProfilePress }: ProfileScreenProps) {
	const [tab, setTab] = useState<AccountTab>("profil");

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.content}>
			<HeaderPill
				dateLabel="Mercredi 11 mars"
				initials={patient.initials}
				onProfilePress={onProfilePress}
			/>

			<SectionTitle
				title="Compte"
				subtitle="Informations du patient et préférences de l'application"
			/>

			<View style={styles.tabs}>
				<TouchableOpacity
					style={[styles.tab, tab === "profil" && styles.tabActive]}
					onPress={() => setTab("profil")}
					activeOpacity={0.8}
				>
					<Text
						style={[styles.tabText, tab === "profil" && styles.tabTextActive]}
					>
						Profil
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.tab, tab === "parametres" && styles.tabActive]}
					onPress={() => setTab("parametres")}
					activeOpacity={0.8}
				>
					<Text
						style={[
							styles.tabText,
							tab === "parametres" && styles.tabTextActive,
						]}
					>
						Paramètres
					</Text>
				</TouchableOpacity>
			</View>

			{tab === "profil" && (
				<>
					<Card style={styles.card}>
						<View style={styles.profileRow}>
							<View style={styles.profileAvatar}>
								<Text style={styles.profileInitials}>{patient.initials}</Text>
							</View>
							<View style={styles.profileInfo}>
								<Text style={styles.profileName}>{patient.name}</Text>
								<Text style={styles.profileSensor}>{patient.sensor}</Text>
								<Text style={styles.profileSync}>
									Synchronisé {patient.syncAgo}
								</Text>
							</View>
						</View>
					</Card>
					<Text style={styles.sectionLabel}>PARAMÈTRES</Text>
					<Card style={styles.card}>
						{PROFILE_SETTINGS.map((item) => (
							<TouchableOpacity
								key={item.key}
								style={styles.settingRow}
								activeOpacity={0.7}
							>
								<View style={styles.settingIcon} />
								<View style={styles.settingContent}>
									<Text style={styles.settingLabel}>{item.label}</Text>
									<Text style={styles.settingValue}>{item.value}</Text>
								</View>
								<Text style={styles.settingChevron}>›</Text>
							</TouchableOpacity>
						))}
					</Card>
				</>
			)}

			{tab === "parametres" && (
				<Card style={styles.card}>
					<Text style={styles.cardLabel}>PARAMÈTRES</Text>
					{PARAM_ITEMS.map((label) => (
						<TouchableOpacity
							key={label}
							style={styles.paramRow}
							activeOpacity={0.7}
						>
							<Text style={styles.paramText}>{label}</Text>
							<Text style={styles.paramChevron}>›</Text>
						</TouchableOpacity>
					))}
					<TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8}>
						<Text style={styles.logoutText}>Déconnexion</Text>
					</TouchableOpacity>
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
		marginBottom: 20,
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
	card: { marginBottom: 16 },
	cardLabel: {
		fontSize: 11,
		letterSpacing: 2,
		color: colors.textSecondary,
		marginBottom: 12,
	},
	profileRow: { flexDirection: "row", alignItems: "center" },
	profileAvatar: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: colors.teal,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 16,
	},
	profileInitials: { fontSize: 18, fontWeight: "bold", color: colors.onTeal },
	profileInfo: {},
	profileName: { fontSize: 20, fontWeight: "600", color: colors.text },
	profileSensor: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
	profileSync: { fontSize: 12, color: colors.muted, marginTop: 2 },
	sectionLabel: {
		fontSize: 11,
		letterSpacing: 2,
		color: colors.label,
		fontWeight: "600",
		marginBottom: 8,
	},
	settingRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	settingIcon: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: colors.mint,
		marginRight: 12,
	},
	settingContent: { flex: 1 },
	settingLabel: { fontSize: 15, fontWeight: "600", color: colors.text },
	settingValue: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
	settingChevron: { fontSize: 18, color: colors.muted },
	paramRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 14,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	paramText: { fontSize: 15, color: colors.text },
	paramChevron: { fontSize: 18, color: colors.muted },
	logoutBtn: {
		marginTop: 12,
		paddingVertical: 14,
		alignItems: "center",
		borderRadius: radius.md,
		backgroundColor: "#fff5f5",
		borderWidth: 1,
		borderColor: "#f3d6d6",
	},
	logoutText: { fontSize: 15, fontWeight: "600", color: "#b45309" },
});
