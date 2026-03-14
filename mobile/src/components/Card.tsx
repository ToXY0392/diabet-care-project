import type { ReactNode } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { colors, radius } from "../theme";

type Variant = "default" | "hero" | "surface";

type CardProps = {
	variant?: Variant;
	children: ReactNode;
	style?: ViewStyle;
};

export function Card({ variant = "surface", children, style }: CardProps) {
	return (
		<View
			style={[
				styles.base,
				variant === "hero" && styles.hero,
				variant === "surface" && styles.surface,
				style,
			]}
		>
			{children}
		</View>
	);
}

const styles = StyleSheet.create({
	base: {
		borderRadius: radius.lg,
		padding: 20,
		overflow: "hidden",
	},
	hero: {
		backgroundColor: colors.teal,
		padding: 24,
	},
	surface: {
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
	},
});
