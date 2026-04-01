import { getLedger, deleteLedger } from '$lib/services/ledgers';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params }) => {
	const ledger = await getLedger(params.id);
	if (!ledger) error(404, { message: 'Ledger not found' });

	return { ledger };
};

export const actions = {
  default: async ({ params }) => {
		await deleteLedger(params.id);
		redirect(303, '/');
	}
} satisfies Actions;
