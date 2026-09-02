import type { Handle } from '@sveltejs/kit';
import { createSessionClient, SESSION_COOKIE } from '$lib/server/appwrite';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionSecret = event.cookies.get(SESSION_COOKIE);

	event.locals.currentUser = null;
	event.locals.teamMembers = null;
	event.locals.tablesDB = null;

	if (sessionSecret) {
		try {
			const { account, teams, tablesDB } = createSessionClient(sessionSecret);
			const [user, { teams: myTeams}] = await Promise.all([account.get(), teams.list()]);
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
					
					event.locals.teamMembers = memberships.map((membership) => ({
						id: membership.userId,
						name: membership.userName,
						email: membership.userEmail,
						role: membership.roles[0] as 'owner' | 'partner',
						teamId: team.$id
          }));
					
					event.locals.tablesDB = tablesDB;
				}
			}
		} catch (err) {
			console.error('hooks auth resolution failed:', err);
		}
	}
	return resolve(event);
};
