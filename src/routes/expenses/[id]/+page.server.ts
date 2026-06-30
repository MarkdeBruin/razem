import { getAllCategories, getAllKeywords, createKeyword } from '$lib/services/categories.js';
import { getExpense, updateExpense, deleteExpense } from '$lib/services/expenses';
import { getAllLedgers, getAllLedgerTemplates } from '$lib/services/ledgers.js';
import { newExpenseSchema } from '$lib/schemas/expenses';
import { error, fail, redirect } from '@sveltejs/kit';
import * as z from "zod";
import type { Actions, PageServerLoad } from './$types.js';
import type { NewKeyword } from '$lib/schemas/category';

export const load: PageServerLoad = async ({ params }) => {
	const expense = await getExpense(params.id);
	if (!expense) error(404, { message: 'Expense not found' });

	const ledgers = await getAllLedgers();
	const categories = await getAllCategories();
	const templates = await getAllLedgerTemplates();
	const keywords = await getAllKeywords();

	return { expense, ledgers, templates, categories, keywords };
};

export const actions = {
	update: async ({ params, request }) => {
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
			const errors = z.flattenError(result.error).fieldErrors;
			return fail(422, { errors: errors });
		}

		await updateExpense(params.id, result.data);

		if (data.get('save-keyword')) {
			const newKeyword: NewKeyword = {
				name: result.data.description,
				categoryId: result.data.categoryId
			};
			await createKeyword(newKeyword);
		}

		return { updated: true };
	},
	delete: async ({ params, request }) => {
		const data = await request.formData();
		const ledgerId = data.get('ledger-id') as string;

		await deleteExpense(params.id);

		redirect(303, `/ledgers/${ledgerId}`);
	}
} satisfies Actions;
