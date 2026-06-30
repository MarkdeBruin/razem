import {
	getKeyword,
	updateKeyword,
	deleteKeyword,
	getAllKeywords,
	getAllCategories
} from '$lib/services/categories';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { newKeywordSchema } from '$lib/schemas/category';
import { keywordExists } from '$lib/utils/categories';
import * as z from 'zod';

export const load: PageServerLoad = async ({ params }) => {
	const keyword = await getKeyword(params.id);
	if (!keyword) error(404, { message: 'Keyword not found' });
	const categories = await getAllCategories();
	const keywords = await getAllKeywords();
	return { keyword, categories, keywords };
};

export const actions = {
	update: async ({ params, request }) => {
		const data = await request.formData();

		const name = (data.get('keyword') as string | null)
			?.trim()
			.replace(/^\w/, (c) => c.toUpperCase());

		const result = newKeywordSchema.safeParse({ name, categoryId: data.get('category') });

		if (!result.success) {
			const { fieldErrors } = z.flattenError(result.error);
			return fail(422, { errors: fieldErrors });
		}

		const existingKeywords = await getAllKeywords();
		if (keywordExists(result.data.name, existingKeywords, params.id)) {
			return fail(422, { keywordDuplicate: true, duplicateName: result.data.name });
		}

    await updateKeyword(params.id, result.data);
		
		return { updated: true };
	},
	delete: async ({ params }) => {
		await deleteKeyword(params.id);
		redirect(303, '/settings/categories');
	}
} satisfies Actions;
