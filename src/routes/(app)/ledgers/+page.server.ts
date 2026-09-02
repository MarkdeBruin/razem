import { getHomeLedgers } from '$lib/services/ledgers';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	return { ledgers: await getHomeLedgers(locals.tablesDB!, locals.currentUser!.teamId) };
};
