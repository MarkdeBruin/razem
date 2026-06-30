import type { User } from '$lib/schemas/users';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			currentUser: User;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
