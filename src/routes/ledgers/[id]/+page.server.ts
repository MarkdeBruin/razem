import { getLedger, deleteLedger } from '$lib/services/ledgers';
import { getExpenses, createExpense } from '$lib/services/expenses';
import { createLedgerTemplate } from '$lib/services/ledgerTemplates.js';
import type { TemplateExpense } from '$lib/types';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params }) => {
	const ledger = await getLedger(params.id);
	const expenses = await getExpenses(params.id);

	if (!ledger) error(404, { message: 'Ledger not found' });

	return { ledger, expenses };
};

export const actions = {
	'create-expense': async ({ locals, params, request }) => {
		const data = await request.formData();

		const description = data.get('description') as string;
		const amount = Number(data.get('amount'));

		if (!description) return fail(422, { error: 'Description is required' });
		if (!amount || amount <= 0) return fail(422, { error: 'Amount must be greater than 0' });

		await createExpense({
			description,
			amount,
			userId: locals.currentUser.id,
			ledgerId: params.id
		});

		return { success: true };
	},
	'create-template': async ({ params, request }) => {
		const data = await request.formData();

		const name = data.get('name') as string;
		if (!name) return fail(422, { error: 'Name is required' });

		const ledger = await getLedger(params.id);
		if (!ledger) error(404, { message: 'Ledger not found' });

		const expenses = await getExpenses(params.id);

		const templateExpenses: TemplateExpense[] = expenses.map(({ description, amount, userId }) => ({
			id: `texp-${crypto.randomUUID()}`,
			description,
			amount,
			userId
		}));

		const newTemplate = await createLedgerTemplate({
			name: name,
			ownerFraction: ledger.ownerFraction,
			expenses: templateExpenses
		});

		return { success: true, id: newTemplate.id };
	},
	'delete-ledger': async ({ params }) => {
		await deleteLedger(params.id);
		redirect(303, '/');
	}
} satisfies Actions;
