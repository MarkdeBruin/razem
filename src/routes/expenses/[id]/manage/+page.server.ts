import { getExpense, updateExpense, deleteExpense } from '$lib/services/expenses';
import { getAllCategories } from '$lib/services/categories.js';
import { addKeyword } from '$lib/services/categories.js';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import type { NewExpense } from '$lib/types/index.js';
import { getAllLedgers } from '$lib/services/ledgers.js';

export const load: PageServerLoad = async ({ params }) => {
	const expense = await getExpense(params.id);
	if (!expense) error(404, { message: 'Expense not found' });

	const ledgers = await getAllLedgers();
	const categories = await getAllCategories();

	return { expense, ledgers, categories };
};

export const actions = {
	update: async ({ locals, params, request }) => {
		const data = await request.formData();

		const ledgerId = data.get('ledger-id') as string;
		if (!ledgerId) return fail(422, { expenseLedgerIdMissing: true });

		const description = data.get('exp-description') as string;
		if (!description) return fail(422, { expenseDescMissing: true });

		const amount = Number(data.get('exp-amount'));
		if (!amount || amount <= 0) return fail(422, { expenseAmountMissing: true });

		const categoryId = data.get('exp-category') as string;
		if (!categoryId) return fail(422, { categoryMissing: true });

		const updatedExpense: NewExpense = {
			ledgerId,
			description,
			amount,
			categoryId,
			userId: locals.currentUser.id
		};

		updateExpense(params.id, updatedExpense);

		if (data.get('save-keyword')) {
			await addKeyword(description, categoryId);
		}

		redirect(303, `/ledgers/${ledgerId}`);
  },
  delete: async ({ params, request }) => {
    const data = await request.formData();
    const ledgerId = data.get('ledger-id') as string;
    
    await deleteExpense(params.id);
		
		redirect(303, `/ledgers/${ledgerId}`);
	}
} satisfies Actions;
