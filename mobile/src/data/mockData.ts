import type {
	ConversationThread,
	DeviceConnection,
	DocumentItem,
	HistoryRow,
	PatientProfile,
} from "../types";

export const patient: PatientProfile = {
	id: "PAT-001",
	name: "Léa Bernard",
	initials: "LB",
	sensor: "Dexcom G7",
	source: "Dexcom",
	syncAgo: "il y a 5 min",
	lastReading: 118,
	tir: 74,
	freshness: "5 min",
	coverage: 93,
};

export const deviceConnections: DeviceConnection[] = [
	{
		vendor: "Dexcom",
		product: "G7",
		status: "Actif",
		lastSync: "il y a 5 min",
	},
	{
		vendor: "LibreView",
		product: "FreeStyle Libre",
		status: "Inactif",
		lastSync: "aucune sync",
	},
];

export const historyRows: HistoryRow[] = [
	{ time: "12:10", value: 118, status: "Stable", note: "Synchronisé" },
	{
		time: "12:05",
		value: 111,
		status: "↗ légère hausse",
		note: "Après collation",
	},
	{ time: "12:00", value: 102, status: "Stable", note: "RAS" },
	{ time: "11:55", value: 88, status: "↘ baisse", note: "Surveillance" },
	{ time: "11:50", value: 72, status: "Bas", note: "Seuil approché" },
];

export const documents: DocumentItem[] = [
	{
		id: "ordonnance-mars",
		title: "Ordonnance mars",
		category: "Prescription",
		date: "11 mars 2026",
		source: "soignant",
		isNew: true,
		content: "Insuline rapide avant repas. Maintien du schéma basal actuel.",
	},
	{
		id: "compte-rendu",
		title: "Compte-rendu consultation",
		category: "Clinique",
		date: "09 mars 2026",
		source: "soignant",
		content: "Temps dans la cible satisfaisant. Réévaluation prévue.",
	},
	{
		id: "bilan-mars-patient",
		title: "Bilan glycémique mars.pdf",
		category: "PDF",
		date: "10 mars 2026",
		source: "patient",
		status: "Consulté",
		content: "Document patient transmis à l'équipe soignante.",
	},
];

export const patientThreads: ConversationThread[] = [
	{
		id: "dr-martin",
		name: "Dr Martin",
		initials: "DM",
		preview: "Parfait. Votre tendance Dexcom reste stable.",
		time: "08:04",
		unread: 1,
		online: true,
		messages: [
			{
				id: "m1",
				author: "Dr Martin",
				side: "them",
				text: "Pensez à joindre votre dernier bilan dans l'application.",
				time: "07:52",
				date: "Aujourd'hui",
			},
			{
				id: "m2",
				author: "Léa Bernard",
				side: "me",
				text: "Je vous l'envoie aujourd'hui avec mes mesures du matin.",
				time: "08:03",
				date: "Aujourd'hui",
				status: "delivered",
			},
			{
				id: "m3",
				author: "Dr Martin",
				side: "them",
				text: "Parfait. Votre tendance Dexcom reste stable.",
				time: "08:04",
				date: "Aujourd'hui",
			},
		],
	},
	{
		id: "service-suivi",
		name: "Service suivi",
		initials: "SS",
		preview: "Votre document a bien été reçu.",
		time: "07:20",
		unread: 0,
		online: false,
		messages: [
			{
				id: "s1",
				author: "Service suivi",
				side: "them",
				text: "Votre document a bien été reçu.",
				time: "07:20",
				date: "Aujourd'hui",
			},
			{
				id: "s2",
				author: "Léa Bernard",
				side: "me",
				text: "Merci pour la confirmation.",
				time: "07:24",
				date: "Aujourd'hui",
				status: "read",
			},
		],
	},
	{
		id: "dr-lambert",
		name: "Dr Lambert",
		initials: "DL",
		preview: "On garde le même schéma aujourd'hui.",
		time: "Hier",
		unread: 0,
		online: false,
		messages: [
			{
				id: "l0",
				author: "Léa Bernard",
				side: "me",
				text: "Bonjour Dr Lambert, j'ai eu un épisode d'hypoglycémie hier soir.",
				time: "08:30",
				date: "Hier",
				status: "read",
			},
			{
				id: "l1",
				author: "Dr Lambert",
				side: "them",
				text: "On garde le même schéma aujourd'hui et on réévalue demain.",
				time: "09:22",
				date: "Hier",
			},
		],
	},
];

const providerDocuments = documents.filter((d) => d.source === "soignant");
const patientDocuments = documents.filter((d) => d.source === "patient");
export { providerDocuments, patientDocuments };
