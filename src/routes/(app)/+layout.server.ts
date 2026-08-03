import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.currentUser || !locals.teamMembers) {
		redirect(303, '/login');
	}

	const currentUser = locals.currentUser;
	const teamMembers = locals.teamMembers;

	const owner = teamMembers.find((u) => u.role === 'owner')!;
	const partner = teamMembers.find((u) => u.role === 'partner')!;
	const otherUser = currentUser.id === owner.id ? partner : owner;

	return { currentUser, owner, partner, otherUser };
};