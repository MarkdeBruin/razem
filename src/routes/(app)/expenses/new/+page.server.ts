import { getAllCategories, getAllKeywords, createKeyword } from '$lib/services/categories.js';
import { createExpense } from '$lib/services/expenses';
import { getAllLedgers, getAllLedgerTemplates } from '$lib/services/ledgers';
import { fail, redirect } from '@sveltejs/kit';
import { newExpenseSchema } from '$lib/schemas/expenses';
import * as z from 'zod';
import type { Actions, PageServerLoad } from './$types';
import type { NewKeyword } from '$lib/schemas/category';

export const load: PageServerLoad = async ({ url }) => {
	const ledgers = await getAllLedgers();
	const templates = await getAllLedgerTemplates();
	const categories = await getAllCategories();
	const keywords = await getAllKeywords();

	const ledgerId = url.searchParams.get('ledger') ?? ledgers[0]?.id;
	const from = url.searchParams.get('from');

	const backUrl = from === 'ledger' ? `/ledgers/${ledgerId}` : '/';

	return { ledgers, templates, ledgerId, categories, keywords, backUrl };
};

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const description = (data.get('exp-description') as string | null)
			?.trim()
			.replace(/^\w/, (c) => c.toUpperCase());

		const result = newExpenseSchema.safeParse({
			description,
			amount: Number(data.get('exp-amount')),
			categoryId: data.get('exp-category'),
			userId: data.get('exp-user-id'),
			ledgerId: data.get('ledger-id')
		});

		if (!result.success) {
			const { fieldErrors } = z.flattenError(result.error);
			return fail(422, { errors: fieldErrors });
		}

		await createExpense(result.data);

		if (data.get('save-keyword')) {
			const newKeyword: NewKeyword = {
				name: result.data.description,
				categoryId: result.data.categoryId
			};
			await createKeyword(newKeyword);
		}

		redirect(303, `/ledgers/${result.data.ledgerId}`);
	}
} satisfies Actions;
