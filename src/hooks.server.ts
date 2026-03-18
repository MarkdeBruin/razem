import type { Handle } from '@sveltejs/kit';
import { getUsers } from '$lib/services/users';

export const handle: Handle = async ({ event, resolve }) => {
    const users = await getUsers();
    const currentUser = users.find((u) => u.role === 'owner')!;
    
    event.locals.currentUser = currentUser;

    return resolve(event);
};