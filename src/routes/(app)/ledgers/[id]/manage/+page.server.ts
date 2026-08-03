import { getLedger, updateLedger, deleteLedger } from '$lib/services/ledgers';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import { newLedgerSchema } from '$lib/schemas/ledgers';
import * as z from 'zod';

export const load: PageServerLoad = async ({ params }) => {
	const ledger = await getLedger(params.id);
	if (!ledger) error(404, { message: 'Ledger not found' });

	return { ledger };
};

export const actions = {
	update: async ({ params, request }) => {
		const data = await request.formData();

		const result = newLedgerSchema.safeParse({
			name: data.get('ledger-name'),
			ownerFraction: Number(data.get('owner-percentage')) / 100,
			isTemplate: data.get('is-template') !== null
		});

		if (!result.success) {
			const { fieldErrors } = z.flattenError(result.error);
			return fail(422, { errors: fieldErrors });
		}

		await updateLedger(params.id, result.data);
		return { updated: true };
	},
	delete: async ({ params }) => {
		await deleteLedger(params.id);
		redirect(303, '/');
	}
} satisfies Actions;
