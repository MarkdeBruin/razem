import { getUsers } from '$lib/services/users.js';

export async function load({ params }) {
	const users = await getUsers();

  const currentUser = users.find((u) => u.role === 'owner')!;
	
	const owner = users.find((u) => u.role === 'owner')!;
	const partner = users.find((u) => u.role === 'partner')!;

	return { currentUser, owner, partner };
}
