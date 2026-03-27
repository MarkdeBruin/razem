import type { Handle } from '@sveltejs/kit';
import { getAllUsers } from '$lib/services/users';

export const handle: Handle = async ({ event, resolve }) => {
  const users = await getAllUsers();
	
	const currentUser = users.find((user) => user.role === 'owner')!;
  const owner = users.find((user) => user.role === 'owner')!;
	const partner = users.find((user) => user.role === 'partner')!;

  event.locals.currentUser = currentUser;
  event.locals.owner = owner;
	event.locals.partner = partner;

	return resolve(event);
};
