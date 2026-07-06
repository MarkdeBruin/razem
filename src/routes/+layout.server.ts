import { getBothUsers } from '$lib/services/users';
import { redirect } from '@sveltejs/kit';
import type { User } from '$lib/schemas/users';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, cookies, url }) => {

  const session = cookies.get('session');
  
	if (!session && url.pathname !== '/login') {
		redirect(303, '/login');
	}
  
	if (session && url.pathname === '/login') {
		redirect(303, '/');
  }
	
	const currentUser = locals.currentUser;

	const users = await getBothUsers();
	const owner = users.find((user: User) => user.role === 'owner')!;
	const partner = users.find((user: User) => user.role === 'partner')!;
	const otherUser = currentUser.id === owner.id ? partner : owner;

	return { currentUser, owner, partner, otherUser };
};
