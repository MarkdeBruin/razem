import { getExpenseCategories } from '$lib/services/expenseCategories';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		categories: await getExpenseCategories()
	};
}