import { getAllLedgers } from '$lib/services/ledgers';
import { getAllCategories, getAllKeywords } from '$lib/services/categories.js';
import { createKeyword } from '$lib/services/categories.js';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createExpense } from '$lib/services/expenses';
import type { NewExpense, NewKeyword } from '$lib/types';

export const load: PageServerLoad = async ({ url }) => {
	const ledgers = await getAllLedgers();
	const categories = await getAllCategories();
	const keywords = await getAllKeywords();

	const ledgerId = url.searchParams.get('ledger') ?? ledgers[0]?.id;
	const from = url.searchParams.get('from');

	const backUrl = from === 'ledger' ? `/ledgers/${ledgerId}` : '/';

	return { ledgers, ledgerId, categories, keywords, backUrl };
};

export const actions = {
	default: async ({ locals, request }) => {
		const data = await request.formData();

		const rawDescription = data.get('exp-description') as string;
		if (!rawDescription) return fail(422, { expenseDescMissing: true });
		const description = rawDescription.trim().replace(/^\w/, (c) => c.toUpperCase());

		const amount = Number(data.get('exp-amount'));
		if (!amount || amount <= 0) return fail(422, { expenseAmountMissing: true });

		const categoryId = data.get('exp-category') as string;
		if (!categoryId) return fail(422, { expenseCategoryMissing: true });

		const userId = data.get('exp-user-id') as string;
		if (!userId) return fail(422, { expenseUserIdMissing: true });

		const ledgerId = data.get('ledger-id') as string;
		if (!ledgerId) return fail(422, { expenseLedgerIdMissing: true });

		const newExpense: NewExpense = {
			description,
			amount,
			userId,
			ledgerId,
			categoryId
		};
		await createExpense(newExpense);

		if (data.get('save-keyword')) {
			const newKeyword: NewKeyword = { name: description, categoryId };
			await createKeyword(newKeyword);
		}

		redirect(303, `/ledgers/${ledgerId}`);
	}
} satisfies Actions;
