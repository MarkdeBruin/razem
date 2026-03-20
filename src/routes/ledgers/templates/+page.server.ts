import { getLedgerTemplates } from "$lib/services/ledgerTemplates";

export async function load() {
	return {
		templates: await getLedgerTemplates()
	};
}