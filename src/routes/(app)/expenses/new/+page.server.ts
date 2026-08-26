import {
	getAllCategoriesAndKeywords,
	createKeyword,
	keywordNameExists
} from '$lib/services/categories.js';
import { createExpense } from '$lib/services/expenses';
import { getAllLedgers, splitLedgersAndTemplates } from '$lib/services/ledgers';
import { fail, redirect } from '@sveltejs/kit';
import { newExpenseSchema } from '$lib/schemas/expenses';
import * as z from 'zod';
import type { Actions, PageServerLoad } from './$types';
import type { NewKeyword } from '$lib/schemas/category';

export const load: PageServerLoad = async ({ locals, parent, url }) => {
	const { currentUser } = await parent();
	const all = await getAllLedgers(locals.tablesDB!, currentUser.teamId);
	const { ledgers, templates } = splitLedgersAndTemplates(all);
	const { categories, keywords } = await getAllCategoriesAndKeywords(
		locals.tablesDB!,
		currentUser.teamId
	);
	const ledgerId = url.searchParams.get('ledger') ?? ledgers[0]?.id;
	const from = url.searchParams.get('from');
	const backTo = from === 'ledger'
			? ({ route: '/(app)/ledgers/[id]', params: { id: ledgerId } } as const)
			: ({ route: '/' } as const);
	return { ledgers, templates, ledgerId, categories, keywords, backTo };
};

export const actions = {
	default: async ({ locals, request }) => {
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

		await createExpense(tablesDB, result.data);

		if (data.get('save-keyword')) {
			const isDuplicate = await keywordNameExists(
				tablesDB,
				result.data.description,
				currentUser.teamId
			);
			if (!isDuplicate) {
				const newKeyword: NewKeyword = {
					name: result.data.description,
					categoryId: result.data.categoryId,
					teamId: currentUser.teamId
				};
				await createKeyword(tablesDB, newKeyword);
			}
		}

		redirect(303, `/ledgers/${result.data.ledgerId}`);
	}
} satisfies Actions;
