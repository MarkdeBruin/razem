import { getLedgerTemplates } from "$lib/services/ledgerTemplates";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		templates: await getLedgerTemplates()
	};
}