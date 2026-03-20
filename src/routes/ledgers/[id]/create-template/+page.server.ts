import { getLedger } from '$lib/services/ledgers';
import { getExpenses } from '$lib/services/expenses';
import { createLedgerTemplate } from '$lib/services/ledgerTemplates.js';
import type { NewTemplateExpense, TemplateExpense } from '$lib/types';
import { error, fail } from '@sveltejs/kit';
import type { Actions } from './$types.js';

export async function load({ params }) {
	const ledger = await getLedger(params.id);
	const expenses = await getExpenses(params.id);

	if (!ledger) error(404, { message: 'Ledger not found' });

	return { ledger, expenses };
}

export const actions = {
	create: async ({ params, request }) => {
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

		await createLedgerTemplate({
			name: name,
			ownerFraction: 0.5,
			expenses: templateExpenses
		});

		return { success: true };
	}
} satisfies Actions;
