import { getLedger } from '$lib/services/ledgers';
import { getExpenses } from '$lib/services/expenses';

export async function load({ params }) {
	return {
		ledger: await getLedger(params.id),
		expenses: await getExpenses(params.id)
	};
}
