import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";

type SectionTitleProps = {
	title: string;
	subtitle?: string;
};

export function SectionTitle({ title, subtitle }: SectionTitleProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>{title}</Text>
			{subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 16,
	},
	title: {
		fontSize: 22,
		fontWeight: "bold",
		color: colors.text,
	},
	subtitle: {
		fontSize: 12,
		color: colors.textSecondary,
		marginTop: 4,
	},
});
