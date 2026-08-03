import { getBothUsers } from '$lib/services/users';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, cookies, url }) => {
  const currentUser = locals.currentUser;
  
	if (!currentUser) {
		if (url.pathname !== '/login') redirect(303, '/login');
		return { currentUser: null };
	}
  
	if (url.pathname === '/login') redirect(303, '/');
  
	const users = await getBothUsers();
	const owner = users.find((u) => u.role === 'owner')!;
	const partner = users.find((u) => u.role === 'partner')!;
	const otherUser = currentUser.id === owner.id ? partner : owner;
  
	return { currentUser, owner, partner, otherUser };
};
