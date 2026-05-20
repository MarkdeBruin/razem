import { getKeyword, updateKeyword, deleteKeyword, getAllKeywords, getAllCategories } from '$lib/services/categories';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { NewKeyword } from '$lib/types';
import { keywordExists } from '$lib/utils/categories';

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
		
		const rawKeyword = data.get('keyword') as string;
    if (!rawKeyword) return fail(422, { keywordMissing: true });
    const name = rawKeyword.trim().replace(/^\w/, (c) => c.toUpperCase());
		
		const categoryId = data.get('category') as string;
		if (!categoryId) return fail(422, { categoryMissing: true });

    const existingKeywords = await getAllKeywords();
		if (keywordExists(name, existingKeywords)) {
			return fail(422, { keywordDuplicate: true, duplicateName: name });
		}
		
    const updatedKeyword: NewKeyword = { name, categoryId };
    await updateKeyword(params.id, updatedKeyword);
		
		redirect(303, '/settings/categories');
	},
	delete: async ({ params }) => {
		await deleteKeyword(params.id);
		redirect(303, '/settings/categories');
	}
} satisfies Actions;