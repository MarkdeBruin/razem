import { getAllCategories, getAllKeywords, createKeyword } from '$lib/services/categories';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { NewKeyword } from '$lib/types';
import { keywordExists } from '$lib/utils/categories';

export const load: PageServerLoad = async () => {
	return {
    categories: await getAllCategories(),
		keywords: await getAllKeywords()
	};
};

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const rawKeyword = data.get('keyword') as string;
		if (!rawKeyword) return fail(422, { keywordMissing: true });

		const categoryId = data.get('category') as string;
    if (!categoryId) return fail(422, { categoryMissing: true });
		
    const name = rawKeyword.trim().replace(/^\w/, c => c.toUpperCase());

    const existingKeywords = await getAllKeywords();
		if (keywordExists(name, existingKeywords)) {
			return fail(422, { keywordDuplicate: true, duplicateName: name });
		}
    
    const newKeyword: NewKeyword = { name, categoryId };
		await createKeyword(newKeyword);

		
		return { success: true };
	}
} satisfies Actions;
