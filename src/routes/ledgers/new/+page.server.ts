import { redirect, fail } from '@sveltejs/kit';
import { getLedger, getAllLedgerTemplates } from '$lib/services/ledgers';
import { getAllExpenses } from '$lib/services/expenses';
import { createLedger } from '$lib/services/ledgers';
import { createExpense } from '$lib/services/expenses';
import type { Actions, PageServerLoad } from './$types';
import type { Expense } from '$lib/types';

export const load: PageServerLoad = async ({ url }) => {
	const from = url.searchParams.get('from');
	const backUrl = from === 'overview' ? `/ledgers` : '/';

	return { templates: await getAllLedgerTemplates(), backUrl };
};

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const name = data.get('ledger-name') as string;
		if (!name) return fail(422, { nameMissing: true });

		let ownerFraction = 0.5; // Default fraction (50%)
		let templateExpenses: Expense[] = [];

		const templateId = data.get('ledger-template') as string;
		if (templateId !== 'blank') {
			const template = await getLedger(templateId);

			if (template) {
				ownerFraction = template.ownerFraction;
				templateExpenses = await getAllExpenses(template.id);
			}
		}

    let isTemplate = data.get('is-template') !== null

		const newLedger = await createLedger({ name, ownerFraction, isTemplate });

		await Promise.all(
			templateExpenses.toReversed().map((expense) =>
				createExpense({
					...expense,
					ledgerId: newLedger.id
				})
			)
		);

		redirect(303, `/ledgers/${newLedger.id}`);
	}
} satisfies Actions;
