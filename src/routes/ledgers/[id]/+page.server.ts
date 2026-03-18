import { getLedger } from '$lib/services/ledgers';
import { getExpenses, createExpense } from '$lib/services/expenses';
import { fail } from '@sveltejs/kit';

export async function load({ params }) {
	return {
		ledger: await getLedger(params.id),
		expenses: await getExpenses(params.id)
	};
}

export const actions = {
	create: async ({ locals, params, request }) => {
		const data = await request.formData();

		const description = data.get('description') as string;
		const amount = Number(data.get('amount'));

		if (!description) return fail(422, { error: 'Description is required' });
		if (!amount || amount <= 0) return fail(422, { error: 'Amount must be greater than 0' });

		await createExpense({
			description,
			amount,
			userId: locals.currentUser.id,
			ledgerId: params.id
    });
		
		return { success: true };
	}
};
