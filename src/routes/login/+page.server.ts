import { dev } from '$app/environment';
import { redirect, fail } from '@sveltejs/kit';
import { createAdminClient, SESSION_COOKIE } from '$lib/server/appwrite';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.currentUser) {
		redirect(303, '/');
	}
};

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const password = data.get('password') as string;

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required' });
		}

		const { account } = createAdminClient();

		try {
			const session = await account.createEmailPasswordSession({ email, password });

			cookies.set(SESSION_COOKIE, session.secret, {
				path: '/',
				httpOnly: true,
				secure: !dev,
				sameSite: 'lax',
				expires: new Date(session.expire)
			});
		} catch {
			return fail(401, { error: 'Invalid credentials' });
		}

		redirect(303, '/');
	}
} satisfies Actions;