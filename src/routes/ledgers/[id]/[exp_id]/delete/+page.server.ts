import { getExpense, deleteExpense } from '$lib/services/expenses.js';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params }) => {
	const expense = await getExpense(params.exp_id);
	if (!expense) error(404, { message: 'Expense not found' });

	return { expense };
};

export const actions = {
  default: async ({ params }) => {
		await deleteExpense(params.exp_id);
		redirect(303, `/ledgers/${params.id}`);
	}
} satisfies Actions;