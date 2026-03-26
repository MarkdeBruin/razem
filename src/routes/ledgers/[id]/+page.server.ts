import { getLedger } from '$lib/services/ledgers';
import { getAllExpenses, createExpense, deleteExpense } from '$lib/services/expenses';
import { getAllCategories } from '$lib/services/categories.js';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params }) => {
	const ledger = await getLedger(params.id);
	if (!ledger) error(404, { message: 'Ledger not found' });

	const categories = await getAllCategories();
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
	
  const expenses = await getAllExpenses(params.id);
	const expensesWithCategory = expenses.map((e) => ({
		...e,
		categoryName: categoryMap.get(e.categoryId) ?? 'Uncategorised'
	}));

	return {
		ledger,
		categories,
		expenses: expensesWithCategory
	};
};

export const actions = {
	'create-expense': async ({ locals, params, request }) => {
		const data = await request.formData();

		const description = data.get('exp-description') as string;
		if (!description) return fail(422, { expenseDescMissing: true });

		const amount = Number(data.get('exp-amount'));
		if (!amount || amount <= 0) return fail(422, { expenseAmountMissing: true });

		const categoryId = data.get('exp-category') as string;
		if (!categoryId) return fail(422, { categoryMissing: true });

		await createExpense({
			description,
			amount,
			userId: locals.currentUser.id,
			ledgerId: params.id,
			categoryId
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
