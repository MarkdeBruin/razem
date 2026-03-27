import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const currentUser = locals.currentUser;
	const owner = locals.owner;
	const partner = locals.partner;

	return { currentUser, owner, partner };
};
