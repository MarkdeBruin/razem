import { getLedger } from '$lib/services/ledgers';
import { getExpenses, createExpense, deleteExpense } from '$lib/services/expenses';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params }) => {
	const ledger = await getLedger(params.id);
	if (!ledger) error(404, { message: 'Ledger not found' });

	const expenses = await getExpenses(params.id);

	return { ledger, expenses };
};

export const actions = {
	'create-expense': async ({ locals, params, request }) => {
		const data = await request.formData();

		const description = data.get('description') as string;
		if (!description) return fail(422, { expenseDescMissing: true });

		const amount = Number(data.get('amount'));
		if (!amount || amount <= 0) return fail(422, { expenseAmountMissing: true });

		await createExpense({
			description,
			amount,
			userId: locals.currentUser.id,
			ledgerId: params.id
		});

		return { success: true };
	},
	'delete-expense': async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id') as string;

		await deleteExpense(id);

		return { success: true };
	}
} satisfies Actions;
