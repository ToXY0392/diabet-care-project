import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Badge } from "../components/Badge";
import { Card } from "../components/Card";
import { HeaderPill } from "../components/HeaderPill";
import { SectionTitle } from "../components/SectionTitle";
import { deviceConnections, patient } from "../data/mockData";
import { colors, spacing } from "../theme";

type SensorScreenProps = {
	onProfilePress?: () => void;
};

export function SensorScreen({ onProfilePress }: SensorScreenProps) {
	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.content}>
			<HeaderPill
				dateLabel="Mercredi 11 mars"
				initials={patient.initials}
				onProfilePress={onProfilePress}
			/>
			<SectionTitle
				title="Capteur"
				subtitle="Connexion active et état de synchronisation"
			/>

			<Card variant="hero" style={styles.heroCard}>
				<Text style={styles.heroLabel}>CAPTEUR PRINCIPAL</Text>
				<Text style={styles.heroSensor}>{patient.sensor}</Text>
				<Text style={styles.heroValue}>{patient.lastReading}</Text>
				<Text style={styles.heroUnit}>mg/dL</Text>
				<Text style={styles.heroSync}>
					Stable · synchronisé {patient.syncAgo}
				</Text>
			</Card>

			<Card variant="hero" style={styles.connectionsCard}>
				<Text style={styles.connectionsTitle}>CONNEXIONS</Text>
				{deviceConnections.map((conn) => (
					<View
						key={`${conn.vendor}-${conn.product}`}
						style={styles.connectionRow}
					>
						<View style={styles.connectionContent}>
							<Text style={styles.connectionName}>
								{conn.vendor} {conn.product}
							</Text>
							<Text style={styles.connectionSync}>
								Dernière sync : {conn.lastSync}
							</Text>
						</View>
						{conn.status === "Actif" && (
							<Badge label={conn.status} tone="info" />
						)}
					</View>
				))}
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
		fontSize: 22,
		fontWeight: "600",
		color: colors.onTeal,
		marginBottom: 8,
	},
	heroValue: { fontSize: 60, fontWeight: "bold", color: colors.onTeal },
	heroUnit: { fontSize: 18, color: colors.onTeal, marginTop: -4 },
	heroSync: { fontSize: 14, color: colors.onTeal, opacity: 0.9, marginTop: 4 },
	connectionsCard: {},
	connectionsTitle: {
		fontSize: 11,
		letterSpacing: 2,
		color: colors.onTeal,
		marginBottom: 12,
	},
	connectionRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "rgba(255,255,255,0.15)",
		borderRadius: 22,
		padding: 16,
		marginBottom: 8,
	},
	connectionContent: {},
	connectionName: { fontSize: 15, fontWeight: "600", color: colors.onTeal },
	connectionSync: {
		fontSize: 12,
		color: colors.onTeal,
		opacity: 0.9,
		marginTop: 2,
	},
});
