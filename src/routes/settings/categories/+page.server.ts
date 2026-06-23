import { getAllCategories, getAllKeywords } from '$lib/services/categories';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		categories: await getAllCategories(),
		keywords: await getAllKeywords()
	};
};
