import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
	type RouteProp,
	useNavigation,
	useRoute,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { ChatScreen } from "../screens/ChatScreen";
import { DashboardScreen } from "../screens/DashboardScreen";
import { ExchangesScreen } from "../screens/ExchangesScreen";
import { MeasuresScreen } from "../screens/MeasuresScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { SensorScreen } from "../screens/SensorScreen";
import { colors } from "../theme";
import type { ConversationThread } from "../types";

export type RootStackParamList = {
	MainTabs: undefined;
	Chat: { thread: ConversationThread };
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
	return (
		<View style={[styles.tabIcon, focused && styles.tabIconActive]}>
			<Text style={[styles.tabIconText, focused && styles.tabIconTextActive]}>
				{label}
			</Text>
		</View>
	);
}

function MainTabs() {
	return (
		<Tab.Navigator
			screenOptions={{
				headerShown: false,
				tabBarStyle: styles.tabBar,
				tabBarActiveTintColor: colors.onTeal,
				tabBarInactiveTintColor: colors.textSecondary,
				tabBarLabelStyle: styles.tabBarLabel,
				tabBarItemStyle: styles.tabBarItem,
			}}
		>
			<Tab.Screen
				name="Accueil"
				component={DashboardScreen}
				options={{
					tabBarLabel: "Accueil",
					tabBarIcon: ({ focused }) => <TabIcon label="⌂" focused={focused} />,
				}}
			/>
			<Tab.Screen
				name="Capteur"
				component={SensorScreen}
				options={{
					tabBarLabel: "Capteur",
					tabBarIcon: ({ focused }) => <TabIcon label="◉" focused={focused} />,
				}}
			/>
			<Tab.Screen
				name="Mesures"
				component={MeasuresScreen}
				options={{
					tabBarLabel: "Mesures",
					tabBarIcon: ({ focused }) => <TabIcon label="▣" focused={focused} />,
				}}
			/>
			<Tab.Screen
				name="Exchanges"
				component={ExchangesScreen}
				options={{
					tabBarLabel: "Échanges",
					tabBarIcon: ({ focused }) => <TabIcon label="✉" focused={focused} />,
				}}
			/>
			<Tab.Screen
				name="Profil"
				component={ProfileScreen}
				options={{
					tabBarLabel: "Profil",
					tabBarIcon: ({ focused }) => <TabIcon label="⚙" focused={focused} />,
				}}
			/>
		</Tab.Navigator>
	);
}

function ChatScreenWrapper() {
	const route = useRoute<RouteProp<RootStackParamList, "Chat">>();
	const navigation = useNavigation();
	const { thread } = route.params;
	return <ChatScreen thread={thread} onBack={() => navigation.goBack()} />;
}

export function AppTabs() {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
				animation: "slide_from_right",
			}}
		>
			<Stack.Screen name="MainTabs" component={MainTabs} />
			<Stack.Screen name="Chat" component={ChatScreenWrapper} />
		</Stack.Navigator>
	);
}

const styles = StyleSheet.create({
	tabBar: {
		backgroundColor: colors.surfaceAlt,
		borderTopWidth: 0,
		borderRadius: 24,
		marginHorizontal: 16,
		marginBottom: 8,
		paddingTop: 8,
		height: 64,
	},
	tabBarLabel: { fontSize: 10 },
	tabBarItem: {},
	tabIcon: {
		width: 32,
		height: 32,
		borderRadius: 16,
		alignItems: "center",
		justifyContent: "center",
	},
	tabIconActive: {
		backgroundColor: colors.teal,
	},
	tabIconText: {
		fontSize: 16,
		color: colors.textSecondary,
	},
	tabIconTextActive: {
		color: colors.onTeal,
	},
});
