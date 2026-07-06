import type { Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const password = data.get('password') as string;

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required' });
		}

		// TODO: replace with Appwrite account.createEmailPasswordSession()
		// and set the a_session_<PROJECT_ID> cookie from the returned session.
		const fakeLoginWorked = true;

		if (!fakeLoginWorked) {
			return fail(401, { error: 'Invalid credentials' });
		}

		cookies.set('session', 'placeholder', { path: '/', httpOnly: true });
		redirect(303, '/');
	}
} satisfies Actions;