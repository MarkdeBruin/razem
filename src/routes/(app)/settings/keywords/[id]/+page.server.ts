import {
	getKeyword,
	updateKeyword,
	deleteKeyword,
	getAllCategoriesAndKeywords,
	keywordNameExists
} from '$lib/services/categories';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { newKeywordSchema } from '$lib/schemas/category';
import * as z from 'zod';

export const load: PageServerLoad = async ({ locals, parent, params }) => {
	const { currentUser } = await parent();

	let keyword;
	try {
		keyword = await getKeyword(locals.tablesDB!, params.id, currentUser.teamId);
	} catch {
		error(404, { message: 'Keyword not found' });
	}

	const { categories, keywords } = await getAllCategoriesAndKeywords(
		locals.tablesDB!,
		currentUser.teamId
	);

	return { keyword, categories, keywords };
};

export const actions = {
	update: async ({ locals, params, request }) => {
		const currentUser = locals.currentUser;
		if (!currentUser || !locals.tablesDB) {
			return fail(401, { error: 'Not authenticated' });
		}
		const tablesDB = locals.tablesDB;

		const data = await request.formData();
		const name = (data.get('keyword') as string | null)
			?.trim()
			.replace(/^\w/, (c) => c.toUpperCase());
		const result = newKeywordSchema.safeParse({
			name,
			categoryId: data.get('category'),
			teamId: currentUser.teamId
		});
		if (!result.success) {
			const { fieldErrors } = z.flattenError(result.error);
			return fail(422, { errors: fieldErrors });
		}

		const isDuplicate = await keywordNameExists(
			tablesDB,
			result.data.name,
			currentUser.teamId,
			params.id
		);
		if (isDuplicate) {
			return fail(422, { keywordDuplicate: true, duplicateName: result.data.name });
		}

		await updateKeyword(tablesDB, params.id, currentUser.teamId, result.data);
		return { updated: true };
	},

	delete: async ({ locals, params }) => {
		const currentUser = locals.currentUser;
		if (!currentUser || !locals.tablesDB) {
			return fail(401, { error: 'Not authenticated' });
		}
		await deleteKeyword(locals.tablesDB, params.id, currentUser.teamId);
		redirect(303, '/settings/categories');
	}
} satisfies Actions;
