import { getAllCategories, getAllKeywords, createKeyword } from '$lib/services/categories';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { newKeywordSchema } from '$lib/schemas/category';
import { keywordExists } from '$lib/utils/categories';
import * as z from 'zod';

export const load: PageServerLoad = async () => {
	return {
		categories: await getAllCategories(),
		keywords: await getAllKeywords()
	};
};

export const actions = {
	default: async ({ request }) => {
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
		if (keywordExists(result.data.name, existingKeywords)) {
			return fail(422, { keywordDuplicate: true, duplicateName: result.data.name });
		}

		const createdKeyword = await createKeyword(result.data);
		redirect(303, `/settings/keywords/${createdKeyword.id}`);
	}
} satisfies Actions;
