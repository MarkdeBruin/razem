import type { User } from '$lib/types';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			currentUser: User;
			owner: User;
			partner: User;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
