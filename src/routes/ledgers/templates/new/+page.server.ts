import { getLedger } from '$lib/services/ledgers';
import { getExpenses } from '$lib/services/expenses.js';
import { createLedgerTemplate } from '$lib/services/ledgerTemplates.js';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import type { TemplateExpense } from '$lib/types/index.js';

export const load: PageServerLoad = async ({ url }) => {
	const ledgerId = url.searchParams.get('from');

	if (ledgerId) {
		const ledger = await getLedger(ledgerId);
    if (!ledger) error(404, { message: 'Ledger not found' });
		
    const expenses = await getExpenses(ledgerId);
    
		return { prefill: true, ledger, expenses };
	}

	redirect(303, `/ledgers/templates`);
};

export const actions = {
  default: async ({ request }) => {
		const data = await request.formData();
 
		const name = data.get('name') as string;
    if (!name) return fail(422, { templateNameMissing: true });
		
    const ledgerId = data.get('ledger-id') as string
    
		const ledger = await getLedger(ledgerId);
    if (!ledger) error(404, { message: 'Ledger not found' });
		
    const expenses = await getExpenses(ledgerId);
 
		const templateExpenses: TemplateExpense[] = expenses.map(({ description, amount, userId }) => ({
			id: `texp-${crypto.randomUUID()}`,
			description,
			amount,
			userId
		}));
 
		const newTemplate = await createLedgerTemplate({
			name: name,
			ownerFraction: ledger.ownerFraction,
			expenses: templateExpenses
		});
 
		redirect(303, `/ledgers/templates/${newTemplate.id}`);
	}
} satisfies Actions;
