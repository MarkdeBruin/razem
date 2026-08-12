import type { User } from '$lib/schemas/users';
import type { TablesDB } from 'node-appwrite';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			currentUser: User | null,
      teamMembers: User[] | null,
      tablesDB: TablesDB | null
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
