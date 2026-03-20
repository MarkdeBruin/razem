import { getUsers } from '$lib/services/users';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const currentUser = locals.currentUser;

	const users = await getUsers();
	const owner = users.find((u) => u.role === 'owner')!;
	const partner = users.find((u) => u.role === 'partner')!;

	return { currentUser, owner, partner };
}
