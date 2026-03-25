import { getAllUsers } from '$lib/services/users';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const currentUser = locals.currentUser;

	const users = await getAllUsers();
	const owner = users.find((user) => user.role === 'owner')!;
	const partner = users.find((user) => user.role === 'partner')!;

	return { currentUser, owner, partner };
}
