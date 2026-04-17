import { getExpense, deleteExpense } from '$lib/services/expenses.js';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params }) => {
	const expense = await getExpense(params.id);
  if (!expense) error(404, { message: 'Expense not found' });

	return { expense };
};

export const actions = {
  default: async ({ params, request }) => {
    const data = await request.formData();
    const ledgerId = data.get('ledger-id') as string;
    
    await deleteExpense(params.id);
		
		redirect(303, `/ledgers/${ledgerId}`);
	}
} satisfies Actions;