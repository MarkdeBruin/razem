import { getLedgerWithExpenses } from '$lib/services/ledgers';
import { getAllCategories } from '$lib/services/categories.js';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Ledger } from '$lib/schemas/ledgers';
import type { Expense } from '$lib/schemas/expenses';

export const load: PageServerLoad = async ({ locals, params, parent, url }) => {
  const { owner, partner } = await parent();
  const categoriesPromise = getAllCategories(locals.tablesDB!, locals.currentUser!.teamId);

	let ledger: Ledger;
	let expenses: Expense[];
	try {
		({ ledger, expenses } = await getLedgerWithExpenses(
			locals.tablesDB!,
			params.id,
			locals.currentUser!.teamId
		));
	} catch {
		error(404, { message: 'Ledger not found' });
	}

  const categories = await categoriesPromise
	const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
	const expensesWithCategory = expenses.map((expense) => ({
		...expense,
		categoryName: categoryMap.get(expense.categoryId) ?? 'Uncategorised'
	}));

	function totalByUser(userId: string): number {
		return expenses
			.filter((expense) => expense.userId === userId)
			.reduce((sum, expense) => sum + expense.amount, 0);
	}

	const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
	const ownerTotal = totalByUser(owner.id);
	const partnerTotal = totalByUser(partner.id);
	const ownerShare = totalExpenses * ledger.ownerFraction;
	const partnerShare = totalExpenses * (1 - ledger.ownerFraction);
	const ownerBalance = Math.round(ownerTotal - ownerShare);
	const partnerBalance = Math.round(partnerTotal - partnerShare);
	const currentBalance = locals.currentUser!.id === owner.id ? ownerBalance : partnerBalance;
	const otherBalance = locals.currentUser!.id === owner.id ? partnerBalance : ownerBalance;
	const from = url.searchParams.get('from');
	const backTo =
		from === 'overview' ? ({ route: '/(app)/ledgers' } as const) : ({ route: '/' } as const);

	return {
		ledger,
		categories,
		expenses: expensesWithCategory,
		totalExpenses,
		ownerTotal,
		partnerTotal,
		ownerShare,
		partnerShare,
		ownerBalance,
		partnerBalance,
		currentBalance,
		otherBalance,
		backTo
	};
};
