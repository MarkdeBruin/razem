import { getLedgerTemplate, deleteLedgerTemplate } from '$lib/services/templates';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const template = await getLedgerTemplate(params.id);
	if (!template) error(404, { message: 'Ledger not found' });

	return { template };
};

export const actions = {
	delete: async ({ params, request }) => {
		const data = await request.formData();

		await deleteLedgerTemplate(params.id);

		redirect(303, `/settings/templates`);
	}
} satisfies Actions;
