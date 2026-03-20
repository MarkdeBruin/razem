import { redirect, fail } from '@sveltejs/kit';
import { getLedgerTemplate, getLedgerTemplates } from '$lib/services/ledgerTemplates';
import { createLedger } from '$lib/services/ledgers';
import { createExpense } from '$lib/services/expenses';
import type { Actions, PageServerLoad } from './$types';
import type { TemplateExpense } from '$lib/types';

export const load: PageServerLoad = async () => {
	return {
		templates: await getLedgerTemplates()
	};
};

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name') as string;
		const templateId = data.get('template') as string;

		if (!name) return fail(422, { error: 'Name is required' });
    
    let ownerFraction = 0.5; // Default fraction (50%)
		let templateExpenses: TemplateExpense[] = [];

		if (templateId !== 'blank') {
			const template = await getLedgerTemplate(templateId);

			if (template) {
				ownerFraction = template.ownerFraction;
				templateExpenses = template.expenses;
			}
		}

		const newLedger = await createLedger({ name, ownerFraction });

		await Promise.all(
			templateExpenses.map((expense) =>
				createExpense({
					description: expense.description,
					amount: expense.amount,
					userId: expense.userId,
					ledgerId: newLedger.id
				})
			)
		);

		redirect(303, `/ledgers/${newLedger.id}`);
	}
} satisfies Actions;
