import { getHomeLedgers} from '$lib/services/ledgers';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { currentUser } = await parent();
	const ledgers = await getHomeLedgers(locals.tablesDB!, currentUser.teamId);

	return { ledgers };
};