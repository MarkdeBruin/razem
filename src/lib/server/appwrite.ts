import { Client, Account, Teams, TablesDB } from 'node-appwrite';
import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT_ID } from '$env/static/public';
import { APPWRITE_API_KEY } from '$env/static/private';

export const SESSION_COOKIE = `a_session_${PUBLIC_APPWRITE_PROJECT_ID}`;

// Admin client: authenticated via API key. Bypasses permissions + rate limits.
// Only use for actions that must run before a user has a session (e.g. login),
// or true admin actions. Safe to reuse across requests.
export function createAdminClient() {
	const client = new Client()
		.setEndpoint(PUBLIC_APPWRITE_ENDPOINT)
		.setProject(PUBLIC_APPWRITE_PROJECT_ID)
		.setKey(APPWRITE_API_KEY);

	return {
		account: new Account(client)
	};
}

// Session client: authenticated as one specific logged-in user via their cookie.
// Must be created fresh per-request. Never share between requests.
export function createSessionClient(sessionSecret: string) {
	const client = new Client()
		.setEndpoint(PUBLIC_APPWRITE_ENDPOINT)
		.setProject(PUBLIC_APPWRITE_PROJECT_ID)
		.setSession(sessionSecret);

	return {
		account: new Account(client),
    teams: new Teams(client),
		tablesDB: new TablesDB(client)
	};
}