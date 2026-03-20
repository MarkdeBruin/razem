import { getLedgers } from '$lib/services/ledgers';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		ledgers: await getLedgers()
	};
}