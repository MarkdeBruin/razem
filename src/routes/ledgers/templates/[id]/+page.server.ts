import { getLedgerTemplate } from '$lib/services/ledgerTemplates';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const template = await getLedgerTemplate(params.id);
	if (!template) error(404, { message: 'Ledger not found' });

	return { template };
};
