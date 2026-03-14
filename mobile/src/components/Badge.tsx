import { StyleSheet, Text, View } from "react-native";
import { colors, radius } from "../theme";

type BadgeProps = {
	label: string;
	tone?: "info" | "neutral";
};

export function Badge({ label, tone = "neutral" }: BadgeProps) {
	return (
		<View style={[styles.badge, tone === "info" && styles.info]}>
			<Text style={[styles.text, tone === "info" && styles.infoText]}>
				{label}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	badge: {
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: radius.full,
		backgroundColor: colors.surfaceAlt,
	},
	info: {
		backgroundColor: colors.teal,
	},
	text: {
		fontSize: 11,
		fontWeight: "600",
		color: colors.textSecondary,
	},
	infoText: {
		color: colors.onTeal,
	},
});
