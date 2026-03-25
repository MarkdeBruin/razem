import type { Handle } from '@sveltejs/kit';
import { getAllUsers } from '$lib/services/users';

export const handle: Handle = async ({ event, resolve }) => {
    const users = await getAllUsers();
    const currentUser = users.find((user) => user.role === 'owner')!;
    
    event.locals.currentUser = currentUser;

    return resolve(event);
};