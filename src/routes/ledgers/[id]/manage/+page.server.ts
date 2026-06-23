import { getLedger, updateLedger, deleteLedger } from '$lib/services/ledgers';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import type { NewLedger } from '$lib/types/index.js';

export const load: PageServerLoad = async ({ params }) => {
	const ledger = await getLedger(params.id);
	if (!ledger) error(404, { message: 'Ledger not found' });

	return { ledger };
};

export const actions = {
	update: async ({ params, request }) => {
		const data = await request.formData();

		const name = data.get('ledger-name') as string;
		if (!name) return fail(422, { nameMissing: true });

		const ownerFraction = Number(data.get('owner-percentage')) / 100;
		if (ownerFraction === null || ownerFraction === undefined)
			return fail(422, { fractionMissing: true });

		let isTemplate = data.get('is-template') !== null;

		const updatedLedger: NewLedger = { name, ownerFraction, isTemplate };

		await updateLedger(params.id, updatedLedger);

		return { updated: true };
	},
	delete: async ({ params }) => {
		await deleteLedger(params.id);
		redirect(303, '/');
	}
} satisfies Actions;
