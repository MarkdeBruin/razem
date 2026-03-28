import { getBothUsers } from '$lib/services/users';
import type { User } from '$lib/types';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const currentUser = locals.currentUser;

	const users = await getBothUsers();
	const owner = users.find((user: User) => user.role === 'owner')!;
	const partner = users.find((user: User) => user.role === 'partner')!;
	const otherUser = currentUser.id === owner.id ? partner : owner;

	return { currentUser, owner, partner, otherUser };
};
