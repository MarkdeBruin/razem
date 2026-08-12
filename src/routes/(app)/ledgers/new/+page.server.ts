import { redirect, fail } from '@sveltejs/kit';
import { getLedger, getAllLedgerTemplates, createLedger } from '$lib/services/ledgers';
import { getAllExpenses, createExpense } from '$lib/services/expenses';
import type { Actions, PageServerLoad } from './$types';
import type { Expense } from '$lib/schemas/expenses';
import { newLedgerSchema } from '$lib/schemas/ledgers';
import * as z from 'zod';

export const load: PageServerLoad = async ({ url, locals, parent }) => {
	const { currentUser } = await parent();
	const from = url.searchParams.get('from');
	const backUrl = from === 'overview' ? '/ledgers' : '/';
	const templates = await getAllLedgerTemplates(locals.tablesDB!, currentUser.teamId);
	return { templates, backUrl };
};

export const actions = {
	default: async ({ locals, request }) => {
		const currentUser = locals.currentUser;
		if (!currentUser || !locals.tablesDB) {
			return fail(401, { error: 'Not authenticated' });
		}
		const tablesDB = locals.tablesDB;

		const data = await request.formData();
		let ownerFraction = 0.5; // Default fraction (50%)
		let templateExpenses: Expense[] = [];
		const templateId = data.get('ledger-template') as string;

		if (templateId !== 'blank') {
			try {
				const template = await getLedger(tablesDB, templateId, currentUser.teamId);
				ownerFraction = template.ownerFraction;
				templateExpenses = await getAllExpenses(template.id); // still mock — unchanged signature
			} catch {
				return fail(404, { error: 'Template not found' });
			}
		}

		const result = newLedgerSchema.safeParse({
			name: data.get('ledger-name'),
			ownerFraction,
			isTemplate: data.get('is-template') !== null,
			teamId: currentUser.teamId
		});
		if (!result.success) {
			const { fieldErrors } = z.flattenError(result.error);
			return fail(422, { errors: fieldErrors });
		}

		const newLedger = await createLedger(tablesDB, result.data);

		await Promise.all(
			templateExpenses.toReversed().map((expense) =>
				createExpense({ // still mock — unchanged signature
					...expense,
					ledgerId: newLedger.id
				})
			)
		);

		redirect(303, `/ledgers/${newLedger.id}`);
	}
} satisfies Actions;