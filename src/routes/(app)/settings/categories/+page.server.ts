import { getAllCategoriesAndKeywords } from '$lib/services/categories';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { categories, keywords } = await getAllCategoriesAndKeywords(
		locals.tablesDB!,
		locals.currentUser!.teamId
	);
	return { categories, keywords };
};
