import { getAllCategoriesAndKeywords, createKeyword, keywordNameExists } from '$lib/services/categories';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { newKeywordSchema } from '$lib/schemas/category';
import * as z from 'zod';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { currentUser } = await parent();
	const { categories, keywords } = await getAllCategoriesAndKeywords(
		locals.tablesDB!,
		currentUser.teamId
	);
	return { categories, keywords };
};

export const actions = {
	default: async ({ locals, request }) => {
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

		const isDuplicate = await keywordNameExists(tablesDB, result.data.name, currentUser.teamId);
		if (isDuplicate) {
			return fail(422, { keywordDuplicate: true, duplicateName: result.data.name });
		}
		const createdKeyword = await createKeyword(tablesDB, result.data);

		redirect(303, `/settings/keywords/${createdKeyword.id}`);
	}
} satisfies Actions;
