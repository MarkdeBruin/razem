import type { Handle } from '@sveltejs/kit';
import { createSessionClient, SESSION_COOKIE } from '$lib/server/appwrite';

export const handle: Handle = async ({ event, resolve }) => {
  const sessionSecret = event.cookies.get(SESSION_COOKIE);
	event.locals.currentUser = null;
  
	if (sessionSecret) {
		try {
			const { account, teams } = createSessionClient(sessionSecret);
			const user = await account.get();
			const { teams: myTeams } = await teams.list();
			const team = myTeams[0];
	
			if (team) {
				const { memberships } = await teams.listMemberships({ teamId: team.$id });
				const membership = memberships.find((m) => m.userId === user.$id);
				const role = membership?.roles[0];

				if (role === 'owner' || role === 'partner') {
					event.locals.currentUser = {
						id: user.$id,
						name: user.name,
						email: user.email,
						role,
						teamId: team.$id
					};
				}
			}
		} catch (err) {
			console.error('hooks auth resolution failed:', err);
		}
	}
  
	return resolve(event);
};
