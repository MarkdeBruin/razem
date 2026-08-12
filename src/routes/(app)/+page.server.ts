import { getAllLedgers, getAllLedgerTemplates } from '$lib/services/ledgers';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { currentUser } = await parent();

	const [ledgers, templates] = await Promise.all([
		getAllLedgers(locals.tablesDB!, currentUser.teamId),
		getAllLedgerTemplates(locals.tablesDB!, currentUser.teamId)
	]);

	return { ledgers, templates };
};