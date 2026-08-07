import type { Category, Keyword } from '$lib/schemas/category';
import type { Expense } from '$lib/schemas/expenses';
import type { Ledger } from '$lib/schemas/ledgers';

export const mockLedgers: Ledger[] = [
	{
		id: 'ledger-1',
		name: 'Monthly expenses',
		ownerFraction: 0.5,
		isTemplate: true,
		teamId: '6a70616d003aff03db73'
	},
	{
		id: 'ledger-2',
		name: 'February 2026',
		ownerFraction: 0.5,
		isTemplate: false,
		teamId: '6a70616d003aff03db73'
	},
	{
		id: 'ledger-3',
		name: 'March 2026',
		ownerFraction: 0.5,
		isTemplate: false,
		teamId: '6a70616d003aff03db73'
	}
];

export const mockExpenses: Expense[] = [
	{
		id: 'exp-1',
		description: 'Rent',
		amount: 1200,
		userId: '6a705fda002d335b2441',
		ledgerId: 'ledger-2',
		categoryId: 'cat-1',
		teamId: '6a70616d003aff03db73'
	},
	{
		id: 'exp-2',
		description: 'Groceries',
		amount: 150,
		userId: '6a705fda002d335b2441',
		ledgerId: 'ledger-1',
		categoryId: 'cat-1',
		teamId: '6a70616d003aff03db73'
	},
	{
		id: 'exp-3',
		description: 'Utilities',
		amount: 80,
		userId: '6a705fda002d335b2441',
		ledgerId: 'ledger-2',
		categoryId: 'cat-1',
		teamId: '6a70616d003aff03db73'
	},
	{
		id: 'exp-4',
		description: 'Internet',
		amount: 40,
		userId: '6a705fda002d335b2441',
		ledgerId: 'ledger-2',
		categoryId: 'cat-1',
		teamId: '6a70616d003aff03db73'
	},
	{
		id: 'exp-5',
		description: 'AH',
		amount: 20,
		userId: '6a70601700249646ab62',
		ledgerId: 'ledger-2',
		categoryId: 'cat-2',
		teamId: '6a70616d003aff03db73'
	},
	{
		id: 'exp-6',
		description: 'Rent',
		amount: 1200,
		userId: '6a705fda002d335b2441',
		ledgerId: 'ledger-3',
		categoryId: 'cat-1',
		teamId: '6a70616d003aff03db73'
	},
	{
		id: 'exp-7',
		description: 'Bol',
		amount: 130,
		userId: '6a70601700249646ab62',
		ledgerId: 'ledger-3',
		categoryId: 'cat-4',
		teamId: '6a70616d003aff03db73'
	},
	{
		id: 'exp-8',
		description: 'Rent',
		amount: 1200,
		userId: '6a705fda002d335b2441',
		ledgerId: 'ledger-1',
		categoryId: 'cat-1',
		teamId: '6a70616d003aff03db73'
	},
	{
		id: 'exp-9',
		description: 'Utilities',
		amount: 80,
		userId: '6a705fda002d335b2441',
		ledgerId: 'ledger-1',
		categoryId: 'cat-1',
		teamId: '6a70616d003aff03db73'
	},
	{
		id: 'texp-10',
		description: 'Internet',
		amount: 40,
		userId: '6a70601700249646ab62',
		ledgerId: 'ledger-1',
		categoryId: 'cat-1',
		teamId: '6a70616d003aff03db73'
	}
];

export const mockCategories: Category[] = [
	{ id: 'cat-1', name: 'Housing' },
	{ id: 'cat-2', name: 'Groceries' },
	{ id: 'cat-3', name: 'Leisure' },
	{ id: 'cat-4', name: 'Other' }
];

export const mockKeywords: Keyword[] = [
	{ id: 'kw-1', name: 'Rent', categoryId: 'cat-1', teamId: '6a70616d003aff03db73' },
	{ id: 'kw-2', name: 'Eneco', categoryId: 'cat-1', teamId: '6a70616d003aff03db73' },
	{ id: 'kw-3', name: 'Water', categoryId: 'cat-1', teamId: '6a70616d003aff03db73' },
	{ id: 'kw-4', name: 'Internet', categoryId: 'cat-1', teamId: '6a70616d003aff03db73' },
	{ id: 'kw-5', name: 'AH', categoryId: 'cat-2', teamId: '6a70616d003aff03db73' },
	{ id: 'kw-6', name: 'Lidl', categoryId: 'cat-2', teamId: '6a70616d003aff03db73' },
	{ id: 'kw-7', name: 'Oriental', categoryId: 'cat-2', teamId: '6a70616d003aff03db73' },
	{ id: 'kw-8', name: 'Dinner', categoryId: 'cat-3', teamId: '6a70616d003aff03db73' },
	{ id: 'kw-9', name: 'Lunch', categoryId: 'cat-3', teamId: '6a70616d003aff03db73' },
	{ id: 'kw-10', name: 'Trip', categoryId: 'cat-3', teamId: '6a70616d003aff03db73' },
	{ id: 'kw-11', name: 'Date', categoryId: 'cat-3', teamId: '6a70616d003aff03db73' },
	{ id: 'kw-12', name: 'Bol', categoryId: 'cat-4', teamId: '6a70616d003aff03db73' },
	{ id: 'kw-13', name: 'Amazon', categoryId: 'cat-4', teamId: '6a70616d003aff03db73' }
];
