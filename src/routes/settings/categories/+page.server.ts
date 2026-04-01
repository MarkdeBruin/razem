import { getAllCategories, getAllKeywords, addKeyword } from '$lib/services/categories';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		categories: await getAllCategories()
	};
};

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const rawKeyword = data.get('keyword') as string;
		if (!rawKeyword) return fail(422, { keywordMissing: true });

		const categoryId = data.get('category') as string;
    if (!categoryId) return fail(422, { categoryMissing: true });
		
    const keyword = rawKeyword.trim().replace(/^\w/, c => c.toUpperCase());
    await addKeyword(keyword, categoryId);
		
		return { success: true };
	}
} satisfies Actions;
