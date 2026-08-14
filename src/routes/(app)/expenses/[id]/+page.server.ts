import {
	getAllCategoriesAndKeywords,
	createKeyword,
	keywordNameExists
} from '$lib/services/categories.js';
import { getExpense, updateExpense, deleteExpense } from '$lib/services/expenses';
import { getAllLedgers, splitLedgersAndTemplates } from '$lib/services/ledgers.js';
import { newExpenseSchema } from '$lib/schemas/expenses';
import { error, fail, redirect } from '@sveltejs/kit';
import * as z from 'zod';
import type { Actions, PageServerLoad } from './$types';
import type { NewKeyword } from '$lib/schemas/category';

export const load: PageServerLoad = async ({ locals, parent, params }) => {
	const { currentUser } = await parent();
	let expense;
	try {
		expense = await getExpense(locals.tablesDB!, params.id, currentUser.teamId);
	} catch {
		error(404, { message: 'Expense not found' });
	}
	const all = await getAllLedgers(locals.tablesDB!, currentUser.teamId);
	const { ledgers, templates } = splitLedgersAndTemplates(all);
	const { categories, keywords } = await getAllCategoriesAndKeywords(
		locals.tablesDB!,
		currentUser.teamId
	);
	return { expense, ledgers, templates, categories, keywords };
};

export const actions = {
	update: async ({ locals, params, request }) => {
		const currentUser = locals.currentUser;
		if (!currentUser || !locals.tablesDB) {
			return fail(401, { error: 'Not authenticated' });
		}
		const tablesDB = locals.tablesDB;
		const data = await request.formData();
		const description = (data.get('exp-description') as string | null)
			?.trim()
			.replace(/^\w/, (c) => c.toUpperCase());
		const result = newExpenseSchema.safeParse({
			description,
			amount: Number(data.get('exp-amount')),
			categoryId: data.get('exp-category'),
			userId: data.get('exp-user-id'),
			ledgerId: data.get('ledger-id'),
			teamId: currentUser.teamId
		});
		if (!result.success) {
			const { fieldErrors } = z.flattenError(result.error);
			return fail(422, { errors: fieldErrors });
		}

		await updateExpense(tablesDB, params.id, currentUser.teamId, result.data);

		let keywordSaved = true;
		if (data.get('save-keyword')) {
			const isDuplicate = await keywordNameExists(
				tablesDB,
				result.data.description,
				currentUser.teamId
			);
			if (isDuplicate) {
				keywordSaved = false;
			} else {
				const newKeyword: NewKeyword = {
					name: result.data.description,
					categoryId: result.data.categoryId,
					teamId: currentUser.teamId
				};
				await createKeyword(tablesDB, newKeyword);
			}
		}

		return { updated: true, keywordSaved };
	},

	delete: async ({ locals, params, request }) => {
		const currentUser = locals.currentUser;
		if (!currentUser || !locals.tablesDB) {
			return fail(401, { error: 'Not authenticated' });
		}
		const tablesDB = locals.tablesDB;
		const data = await request.formData();
		const ledgerId = data.get('ledger-id') as string;
		await deleteExpense(tablesDB, params.id, currentUser.teamId);
		redirect(303, `/ledgers/${ledgerId}`);
	}
} satisfies Actions;
