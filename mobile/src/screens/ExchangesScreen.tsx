import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
	FlatList,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Badge } from "../components/Badge";
import { Card } from "../components/Card";
import { HeaderPill } from "../components/HeaderPill";
import {
	patient,
	patientDocuments,
	patientThreads,
	providerDocuments,
} from "../data/mockData";
import { colors, radius, spacing } from "../theme";
import type { ConversationThread, DocumentItem, ExchangeTab } from "../types";

type ExchangesScreenProps = {
	onProfilePress?: () => void;
	onNewMessage?: () => void;
};

export function ExchangesScreen({
	onProfilePress,
	onNewMessage,
}: ExchangesScreenProps) {
	const [tab, setTab] = useState<ExchangeTab>("messages");
	const navigation = useNavigation();
	const openChat = (thread: ConversationThread) => {
		(
			navigation.getParent() as {
				navigate: (
					name: string,
					params: { thread: ConversationThread },
				) => void;
			}
		)?.navigate("Chat", { thread });
	};

	return (
		<View style={styles.container}>
			<HeaderPill
				dateLabel="Mercredi 11 mars"
				initials={patient.initials}
				onProfilePress={onProfilePress}
			/>

			<View style={styles.breadcrumb}>
				<Text style={styles.breadcrumbItem}>Échanges</Text>
				<Text style={styles.breadcrumbSep}> › </Text>
				<Text style={styles.breadcrumbActive}>
					{tab === "messages" ? "Messages" : "Documents"}
				</Text>
			</View>

			<View style={styles.tabs}>
				<TouchableOpacity
					style={[styles.tab, tab === "messages" && styles.tabActive]}
					onPress={() => setTab("messages")}
					activeOpacity={0.8}
				>
					<Text
						style={[styles.tabText, tab === "messages" && styles.tabTextActive]}
					>
						Messages
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.tab, tab === "documents" && styles.tabActive]}
					onPress={() => setTab("documents")}
					activeOpacity={0.8}
				>
					<Text
						style={[
							styles.tabText,
							tab === "documents" && styles.tabTextActive,
						]}
					>
						Documents
					</Text>
				</TouchableOpacity>
			</View>

			{tab === "messages" && (
				<>
					<TouchableOpacity
						style={styles.newMessageBtn}
						onPress={onNewMessage}
						activeOpacity={0.85}
					>
						<Text style={styles.newMessageText}>Nouveau message</Text>
					</TouchableOpacity>
					<Card style={styles.cardMessages}>
						<Text style={styles.cardLabel}>MES MESSAGES</Text>
						<Text style={styles.cardSubtitle}>
							Conversations prioritaires et non lus
						</Text>
						<FlatList
							data={patientThreads}
							keyExtractor={(item) => item.id}
							style={styles.threadList}
							contentContainerStyle={styles.threadListContent}
							renderItem={({ item }) => (
								<TouchableOpacity
									style={styles.threadRow}
									onPress={() => openChat(item)}
									activeOpacity={0.7}
								>
									<View style={styles.avatar}>
										<Text style={styles.avatarText}>{item.initials}</Text>
									</View>
									<View style={styles.threadContent}>
										<View style={styles.threadHeader}>
											<Text style={styles.threadName}>{item.name}</Text>
											{item.unread > 0 && (
												<Badge
													label={`${item.unread} non lu${item.unread > 1 ? "s" : ""}`}
													tone="info"
												/>
											)}
										</View>
										<Text style={styles.threadPreview} numberOfLines={1}>
											{item.preview}
										</Text>
									</View>
									<Text style={styles.threadTime}>{item.time}</Text>
								</TouchableOpacity>
							)}
						/>
					</Card>
				</>
			)}

			{tab === "documents" && (
				<ScrollView
					style={styles.docScroll}
					contentContainerStyle={styles.docList}
				>
					<Card style={styles.card}>
						<Text style={styles.cardLabel}>ENVOYÉS PAR LE SOIGNANT</Text>
						{providerDocuments.map((doc) => (
							<DocRow key={doc.id} doc={doc} />
						))}
					</Card>
					<Card style={styles.card}>
						<Text style={styles.cardLabel}>MES DOCUMENTS ENVOYÉS</Text>
						{patientDocuments.map((doc) => (
							<DocRow key={doc.id} doc={doc} />
						))}
					</Card>
				</ScrollView>
			)}
		</View>
	);
}

function DocRow({ doc }: { doc: DocumentItem }) {
	return (
		<View style={styles.docRow}>
			<Text style={styles.docTitle}>{doc.title}</Text>
			<Text style={styles.docMeta}>
				{doc.category} · {doc.date}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: colors.bg },
	breadcrumb: {
		flexDirection: "row",
		marginBottom: 12,
	},
	breadcrumbItem: { fontSize: 12, color: colors.textSecondary },
	breadcrumbSep: { fontSize: 12, color: colors.textSecondary },
	breadcrumbActive: { fontSize: 12, fontWeight: "600", color: colors.text },
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
	newMessageBtn: {
		backgroundColor: colors.teal,
		paddingVertical: 12,
		borderRadius: radius.lg,
		alignItems: "center",
		marginBottom: 16,
	},
	newMessageText: { fontSize: 14, fontWeight: "600", color: colors.onTeal },
	card: { marginBottom: 16, padding: 16 },
	cardMessages: { marginBottom: 16, padding: 16, flex: 1 },
	threadList: { flex: 1 },
	threadListContent: { paddingBottom: 24 },
	cardLabel: {
		fontSize: 11,
		letterSpacing: 2,
		color: colors.textSecondary,
		fontWeight: "600",
		marginBottom: 4,
	},
	cardSubtitle: { fontSize: 12, color: colors.muted, marginBottom: 12 },
	threadRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: colors.teal,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},
	avatarText: { fontSize: 12, fontWeight: "bold", color: colors.onTeal },
	threadContent: { flex: 1 },
	threadHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
	threadName: { fontSize: 14, fontWeight: "600", color: colors.text },
	threadPreview: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
	threadTime: { fontSize: 11, color: colors.textSecondary },
	docScroll: { flex: 1 },
	docList: { padding: spacing.lg, paddingBottom: 100 },
	docRow: {
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	docTitle: { fontSize: 14, fontWeight: "600", color: colors.text },
	docMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
});
