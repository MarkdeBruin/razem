import { getLedgerTemplate, deleteLedgerTemplate } from '$lib/services/templates';
import { getAllExpenses } from '$lib/services/expenses';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const template = await getLedgerTemplate(params.id);
	if (!template) error(404, { message: 'Ledger not found' });
	const expenses = await getAllExpenses(template.id);
	return { template, expenses  };
};

export const actions = {
	delete: async ({ params, request }) => {
		const data = await request.formData();

		await deleteLedgerTemplate(params.id);

		redirect(303, `/settings/templates`);
	}
} satisfies Actions;
