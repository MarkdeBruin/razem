import { getLedger, updateLedger, deleteLedger } from '$lib/services/ledgers';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import { newLedgerSchema } from '$lib/schemas/ledgers';
import * as z from 'zod';

export const load: PageServerLoad = async ({ locals, params }) => {
	let ledger;
	try {
		ledger = await getLedger(locals.tablesDB!, params.id, locals.currentUser!.teamId);
	} catch {
		error(404, { message: 'Ledger not found' });
	}

	return { ledger };
};

export const actions = {
	update: async ({ locals, params, request }) => {
		const currentUser = locals.currentUser;
		if (!currentUser || !locals.tablesDB) {
			return fail(401, { error: 'Not authenticated' });
		}
		const tablesDB = locals.tablesDB;

		const data = await request.formData();
		const result = newLedgerSchema.safeParse({
			name: data.get('ledger-name'),
			ownerFraction: Number(data.get('owner-percentage')) / 100,
			isTemplate: data.get('is-template') !== null,
			teamId: currentUser.teamId
		});
		if (!result.success) {
			const { fieldErrors } = z.flattenError(result.error);
			return fail(422, { errors: fieldErrors });
		}

		await updateLedger(tablesDB, params.id, currentUser.teamId, result.data);
		return { updated: true };
	},

	delete: async ({ locals, params }) => {
		const currentUser = locals.currentUser;
		if (!currentUser || !locals.tablesDB) {
			return fail(401, { error: 'Not authenticated' });
		}
		const tablesDB = locals.tablesDB;

		await deleteLedger(tablesDB, params.id, currentUser.teamId);
		redirect(303, '/');
	}
} satisfies Actions;