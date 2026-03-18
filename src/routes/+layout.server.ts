import { getUsers } from '$lib/services/users.js';

export async function load({ locals }) {
	const currentUser = locals.currentUser;

	const users = await getUsers();
	const owner = users.find((u) => u.role === 'owner')!;
	const partner = users.find((u) => u.role === 'partner')!;

	return { currentUser, owner, partner };
}
