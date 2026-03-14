import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, radius } from "../theme";

type HeaderPillProps = {
	dateLabel: string;
	initials: string;
	onProfilePress?: () => void;
};

export function HeaderPill({
	dateLabel,
	initials,
	onProfilePress,
}: HeaderPillProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.date}>{dateLabel}</Text>
			<TouchableOpacity
				style={styles.avatar}
				onPress={onProfilePress}
				activeOpacity={0.8}
			>
				<Text style={styles.initials}>{initials}</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: radius.full,
		paddingHorizontal: 16,
		paddingVertical: 12,
		marginBottom: 16,
	},
	date: {
		fontSize: 14,
		color: colors.text,
		fontWeight: "500",
	},
	avatar: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: colors.teal,
		alignItems: "center",
		justifyContent: "center",
	},
	initials: {
		fontSize: 12,
		fontWeight: "bold",
		color: colors.onTeal,
	},
});
