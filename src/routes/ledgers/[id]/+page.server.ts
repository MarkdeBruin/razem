import { getLedger } from '$lib/services/ledgers';
import { getAllExpenses } from '$lib/services/expenses';
import { getAllCategories } from '$lib/services/categories.js';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ locals, parent, params }) => {
	const ledger = await getLedger(params.id);
	if (!ledger) error(404, { message: 'Ledger not found' });

	const categories = await getAllCategories();
	const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

	const expenses = await getAllExpenses(params.id);
	const expensesWithCategory = expenses.map((expense) => ({
		...expense,
		categoryName: categoryMap.get(expense.categoryId) ?? 'Uncategorised'
  }));
	
	const { owner, partner } = await parent();

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

	const ownerBalance = ownerTotal - ownerShare;
	const partnerBalance = partnerTotal - partnerShare;
	const currentBalance = locals.currentUser.id === owner.id ? ownerBalance : partnerBalance;
  const otherBalance = locals.currentUser.id === owner.id ? partnerBalance : ownerBalance;

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
		otherBalance
	};
};
