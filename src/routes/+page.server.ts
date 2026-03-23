import { getLedgers } from '$lib/services/ledgers';
import { deleteLedger } from '$lib/services/ledgers';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		ledgers: await getLedgers()
	};
};

export const actions = {
	'delete-ledger': async ({ request }) => {
    const data = await request.formData();
    
    const id = data.get('id') as string
    if (!id) return fail(422, { error: 'Id is required' });
		
		await deleteLedger(id);
		redirect(303, '/');
	}
} satisfies Actions;
