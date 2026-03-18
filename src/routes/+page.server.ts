import { getLedgers } from '$lib/services/ledgers';

export async function load() {
	return {
		ledgers: await getLedgers()
	};
}