import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	logout: async ({ cookies }) => {
		// TODO: replace with Appwrite account.deleteSession({ sessionId: 'current' })
		cookies.delete('session', { path: '/' });
		redirect(303, '/login');
	}
} satisfies Actions;