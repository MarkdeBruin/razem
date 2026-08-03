import { redirect } from '@sveltejs/kit';
import { createSessionClient, SESSION_COOKIE } from '$lib/server/appwrite';
import type { Actions } from './$types';

export const actions = {
	logout: async ({ cookies }) => {
		const sessionSecret = cookies.get(SESSION_COOKIE);

		if (sessionSecret) {
			const { account } = createSessionClient(sessionSecret);
			try {
				await account.deleteSession({ sessionId: 'current' });
			} catch {
				// session already invalid — fine, we're clearing the cookie regardless
			}
		}

		cookies.delete(SESSION_COOKIE, { path: '/' });
		redirect(303, '/login');
	}
} satisfies Actions;