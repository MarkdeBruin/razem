import { getAllLedgers, getAllLedgerTemplates } from '$lib/services/ledgers';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async () => {
	return {
		ledgers: await getAllLedgers(),
		templates: await getAllLedgerTemplates()
	};
};
