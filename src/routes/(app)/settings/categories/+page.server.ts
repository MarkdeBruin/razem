import { getAllCategoriesAndKeywords } from '$lib/services/categories';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent }) => {
  const { currentUser } = await parent();
	const { categories, keywords } = await getAllCategoriesAndKeywords(
		locals.tablesDB!,
		currentUser.teamId
	);
	return { categories, keywords };
};
