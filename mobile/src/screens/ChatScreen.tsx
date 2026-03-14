import { useEffect, useRef } from "react";
import {
	FlatList,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radius, spacing } from "../theme";
import type { ConversationThread } from "../types";

type ChatScreenProps = {
	thread: ConversationThread;
	onBack: () => void;
};

export function ChatScreen({ thread, onBack }: ChatScreenProps) {
	const listRef = useRef<FlatList>(null);
	const insets = useSafeAreaInsets();

	useEffect(() => {
		const t = setTimeout(
			() => listRef.current?.scrollToEnd({ animated: false }),
			100,
		);
		return () => clearTimeout(t);
	}, []);

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : undefined}
			keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
		>
			<View style={styles.header}>
				<TouchableOpacity
					onPress={onBack}
					style={styles.backBtn}
					activeOpacity={0.8}
				>
					<Text style={styles.backArrow}>‹</Text>
				</TouchableOpacity>
				<View style={styles.avatar}>
					<Text style={styles.avatarText}>{thread.initials}</Text>
				</View>
				<View style={styles.headerCenter}>
					<Text style={styles.headerName}>{thread.name}</Text>
					<Text style={styles.headerStatus}>
						{thread.online ? "En ligne" : "Hors ligne"}
					</Text>
				</View>
				<TouchableOpacity style={styles.callBtn} activeOpacity={0.8}>
					<Text style={styles.callIcon}>📞</Text>
				</TouchableOpacity>
			</View>

			<FlatList
				ref={listRef}
				data={thread.messages}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.messagesContent}
				renderItem={({ item }) => (
					<View
						style={[
							styles.bubbleWrap,
							item.side === "me" ? styles.bubbleMe : styles.bubbleThem,
						]}
					>
						<View
							style={[
								styles.bubble,
								item.side === "me" ? styles.bubbleMeBg : styles.bubbleThemBg,
							]}
						>
							<Text
								style={[
									styles.bubbleText,
									item.side === "me" && styles.bubbleMeText,
								]}
							>
								{item.text}
							</Text>
							<View style={styles.bubbleFooter}>
								<Text
									style={[
										styles.bubbleTime,
										item.side === "me" && styles.bubbleMeText,
									]}
								>
									{item.time}
								</Text>
								{item.side === "me" && item.status && (
									<Text style={[styles.bubbleStatus, styles.bubbleMeText]}>
										{item.status === "read"
											? "✓✓"
											: item.status === "delivered"
												? "✓✓"
												: "✓"}
									</Text>
								)}
							</View>
						</View>
					</View>
				)}
			/>

			<View
				style={[
					styles.composer,
					{ paddingBottom: Math.max(spacing.lg + 8, insets.bottom + 8) },
				]}
			>
				<TextInput
					style={styles.input}
					placeholder="Message..."
					placeholderTextColor={colors.muted}
					multiline
					maxLength={500}
				/>
				<TouchableOpacity style={styles.sendBtn} activeOpacity={0.8}>
					<Text style={styles.sendText}>Envoyer</Text>
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: colors.bg },
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: spacing.sm,
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
		backgroundColor: colors.surface,
	},
	backBtn: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: colors.mint,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},
	backArrow: { fontSize: 28, color: colors.text, fontWeight: "300" },
	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: colors.teal,
		alignItems: "center",
		justifyContent: "center",
	},
	avatarText: { fontSize: 14, fontWeight: "bold", color: colors.onTeal },
	headerCenter: { flex: 1, marginLeft: 12 },
	headerName: { fontSize: 16, fontWeight: "600", color: colors.text },
	headerStatus: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
	callBtn: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: colors.mint,
		alignItems: "center",
		justifyContent: "center",
	},
	callIcon: { fontSize: 18 },
	messagesContent: { padding: spacing.lg, paddingBottom: 16 },
	bubbleWrap: { marginBottom: 8 },
	bubbleMe: { alignItems: "flex-end" },
	bubbleThem: { alignItems: "flex-start" },
	bubble: {
		maxWidth: "80%",
		paddingHorizontal: 14,
		paddingVertical: 10,
		borderRadius: radius.lg,
	},
	bubbleMeBg: {
		backgroundColor: colors.teal,
		borderBottomRightRadius: 4,
	},
	bubbleThemBg: {
		backgroundColor: colors.mint,
		borderBottomLeftRadius: 4,
	},
	bubbleText: { fontSize: 15, color: colors.text },
	bubbleMeText: { fontSize: 15, color: colors.onTeal },
	bubbleFooter: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 4,
		gap: 4,
	},
	bubbleTime: { fontSize: 11, color: colors.textSecondary },
	bubbleStatus: { fontSize: 11, color: colors.textSecondary },
	composer: {
		flexDirection: "row",
		alignItems: "flex-end",
		padding: spacing.sm,
		paddingBottom: spacing.lg + 8,
		borderTopWidth: 1,
		borderTopColor: colors.border,
		backgroundColor: colors.surface,
	},
	input: {
		flex: 1,
		minHeight: 40,
		maxHeight: 100,
		backgroundColor: colors.surfaceAlt,
		borderRadius: radius.lg,
		paddingHorizontal: 14,
		paddingVertical: 10,
		fontSize: 15,
		color: colors.text,
	},
	sendBtn: {
		marginLeft: 8,
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: colors.teal,
		borderRadius: radius.lg,
		justifyContent: "center",
	},
	sendText: { fontSize: 14, fontWeight: "600", color: colors.onTeal },
});
