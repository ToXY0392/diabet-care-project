export type PatientTab =
	| "accueil"
	| "capteur"
	| "mesures"
	| "echanges"
	| "profil";

export type FollowUpView = "jour" | "tendances" | "carnet";
export type ExchangeTab = "messages" | "documents";
export type AccountTab = "profil" | "parametres";
export type MeasurePeriod = "7j" | "15j" | "30j" | "90j";

export type ConversationMessage = {
	id: string;
	author: string;
	side: "them" | "me";
	text: string;
	time: string;
	date?: string;
	status?: "sent" | "delivered" | "read";
};

export type ConversationThread = {
	id: string;
	name: string;
	initials: string;
	preview: string;
	time: string;
	unread: number;
	online?: boolean;
	messages: ConversationMessage[];
};

export type DocumentItem = {
	id: string;
	title: string;
	category: string;
	date: string;
	content: string;
	source: "soignant" | "patient";
	status?: string;
	isNew?: boolean;
};

export type PatientProfile = {
	id: string;
	name: string;
	initials: string;
	sensor: string;
	source: string;
	syncAgo: string;
	lastReading: number;
	tir: number;
	freshness: string;
	coverage: number;
};

export type DeviceConnection = {
	vendor: string;
	product: string;
	status: string;
	lastSync: string;
};

export type HistoryRow = {
	time: string;
	value: number;
	status: string;
	note: string;
};
