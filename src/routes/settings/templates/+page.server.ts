import { getAllLedgerTemplates } from "$lib/services/templates";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		templates: await getAllLedgerTemplates()
	};
}