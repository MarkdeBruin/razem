import { getLedger, updateLedger } from '$lib/services/ledgers';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import type { NewLedger } from '$lib/types/index.js';

export const load: PageServerLoad = async ({ params }) => {
	const ledger = await getLedger(params.id);

	if (!ledger) error(404, { message: 'Ledger not found' });

	return { ledger };
};

export const actions = {
	default: async ({ params, request }) => {
		const data = await request.formData();

		const name = data.get('ledger-name') as string;
		if (!name) return fail(422, { nameMissing: true });

		const ownerFraction = Number(data.get('owner-percentage')) / 100;
		if (!ownerFraction) return fail(422, { fractionMissing: true });

		const updatedLedger: NewLedger = {
			name: name,
			ownerFraction: ownerFraction
		};

		await updateLedger(params.id, updatedLedger);

		redirect(303, `/ledgers/${params.id}`);
	}
} satisfies Actions;
