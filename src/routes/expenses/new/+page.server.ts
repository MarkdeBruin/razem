import { getAllLedgers } from '$lib/services/ledgers';
import { getAllCategories } from '$lib/services/categories.js';
import { addKeyword } from '$lib/services/categories.js';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createExpense } from '$lib/services/expenses';

export const load: PageServerLoad = async ({ url }) => {
	const ledgers = await getAllLedgers();
	const ledgerId = url.searchParams.get('ledger') ?? ledgers[0]?.id;
	const categories = await getAllCategories();

	return { ledgers, ledgerId, categories };
};

export const actions = {
	default: async ({ locals, request }) => {
    const data = await request.formData();
		
    const ledgerId = data.get('ledger-id') as string;
		if (!ledgerId) return fail(422, { expenseLedgerIdMissing: true });

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
			ledgerId,
			categoryId
    });
		
    if (data.get('save-keyword')) {
      await addKeyword(description, categoryId);
    }

    redirect(303, `/ledgers/${ledgerId}`);
	}
} satisfies Actions;