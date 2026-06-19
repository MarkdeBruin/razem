import { getLedger, updateLedger, deleteLedger } from '$lib/services/ledgers';
import { getAllExpenses, createExpense } from '$lib/services/expenses';
import { createLedgerTemplate } from '$lib/services/templates';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import type { NewLedger } from '$lib/types/index.js';

export const load: PageServerLoad = async ({ params }) => {
	const ledger = await getLedger(params.id);
	if (!ledger) error(404, { message: 'Ledger not found' });

	return { ledger };
};

export const actions = {
	update: async ({ params, request }) => {
		const data = await request.formData();

		const name = data.get('ledger-name') as string;
		if (!name) return fail(422, { nameMissing: true });

		const ownerFraction = Number(data.get('owner-percentage')) / 100;
		if (ownerFraction === null || ownerFraction === undefined)
			return fail(422, { fractionMissing: true });

		const updatedLedger: NewLedger = {
			name: name,
			ownerFraction: ownerFraction
		};

		await updateLedger(params.id, updatedLedger);

		return { updated: true };
	},
	template: async ({ params, request }) => {
		const data = await request.formData();

		const name = data.get('template-name') as string;
		if (!name) return fail(422, { templateNameMissing: true });

		const ledger = await getLedger(params.id);
		if (!ledger) error(404, { message: 'Ledger not found' });

		const expenses = await getAllExpenses(ledger.id);

		const newTemplate = await createLedgerTemplate({
			name,
			ownerFraction: ledger.ownerFraction
		});

		await Promise.all(
			expenses.toReversed().map((expense) =>
				createExpense({
					...expense,
					ledgerId: newTemplate.id
				})
			)
		);

		redirect(303, `/settings/templates/${newTemplate.id}`);
	},
	delete: async ({ params }) => {
		await deleteLedger(params.id);
		redirect(303, '/');
	}
} satisfies Actions;
