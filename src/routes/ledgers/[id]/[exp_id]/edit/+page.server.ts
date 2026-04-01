import { getExpense, updateExpense } from '$lib/services/expenses';
import { getAllCategories } from '$lib/services/categories.js';
import { addKeyword } from '$lib/services/categories.js';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import type { NewExpense } from '$lib/types/index.js';

export const load: PageServerLoad = async ({ params }) => {
	const expense = await getExpense(params.exp_id);
	if (!expense) error(404, { message: 'Expense not found' });

	const categories = await getAllCategories();

	return { expense, categories };
};

export const actions = {
	default: async ({ locals, params, request }) => {
		const data = await request.formData();

		const description = data.get('exp-description') as string;
		if (!description) return fail(422, { expenseDescMissing: true });

		const amount = Number(data.get('exp-amount'));
		if (!amount || amount <= 0) return fail(422, { expenseAmountMissing: true });

		const categoryId = data.get('exp-category') as string;
		if (!categoryId) return fail(422, { categoryMissing: true });

		const updatedExpense: NewExpense = {
			description,
			amount,
			categoryId,
			userId: locals.currentUser.id,
			ledgerId: params.id
		};

		updateExpense(params.exp_id, updatedExpense);

		if (data.get('save-keyword')) {
			await addKeyword(description, categoryId);
		}

		redirect(303, `/ledgers/${params.id}`);
	}
} satisfies Actions;
