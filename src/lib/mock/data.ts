import type { Category } from '$lib/schemas/category';
import type { Expense } from '$lib/schemas/expenses';
import type { Ledger } from '$lib/schemas/ledgers';
import type { User } from '$lib/schemas/users';

export const mockUsers: User[] = [
	{ id: 'user-1', name: 'Mark', email: 'mark@example.com', role: 'owner' },
	{ id: 'user-2', name: 'Anna', email: 'anna@example.com', role: 'partner' }
];

export const mockLedgers: Ledger[] = [
	{
		id: 'ledger-1',
		name: 'Monthly expenses',
		ownerFraction: 0.5,
		isTemplate: true
	},
	{ id: 'ledger-2', name: 'February 2026', ownerFraction: 0.5, isTemplate: false },
	{ id: 'ledger-3', name: 'March 2026', ownerFraction: 0.5, isTemplate: false }
];

export const mockExpenses: Expense[] = [
	{
		id: 'exp-1',
		description: 'Rent',
		amount: 1200,
		userId: 'user-1',
		ledgerId: 'ledger-2',
		categoryId: 'cat-1'
	},
	{
		id: 'exp-2',
		description: 'Groceries',
		amount: 150,
		userId: 'user-1',
		ledgerId: 'ledger-1',
		categoryId: 'cat-1'
	},
	{
		id: 'exp-3',
		description: 'Utilities',
		amount: 80,
		userId: 'user-1',
		ledgerId: 'ledger-2',
		categoryId: 'cat-1'
	},
	{
		id: 'exp-4',
		description: 'Internet',
		amount: 40,
		userId: 'user-1',
		ledgerId: 'ledger-2',
		categoryId: 'cat-1'
	},
	{
		id: 'exp-5',
		description: 'AH',
		amount: 20,
		userId: 'user-2',
		ledgerId: 'ledger-2',
		categoryId: 'cat-2'
	},
	{
		id: 'exp-6',
		description: 'Rent',
		amount: 1200,
		userId: 'user-1',
		ledgerId: 'ledger-3',
		categoryId: 'cat-1'
	},
	{
		id: 'exp-7',
		description: 'Bol',
		amount: 130,
		userId: 'user-2',
		ledgerId: 'ledger-3',
		categoryId: 'cat-4'
	},
	{
		id: 'exp-8',
		description: 'Rent',
		amount: 1200,
		userId: 'user-1',
		ledgerId: 'ledger-1',
		categoryId: 'cat-1'
	},
	{
		id: 'exp-9',
		description: 'Utilities',
		amount: 80,
		userId: 'user-1',
		ledgerId: 'ledger-1',
		categoryId: 'cat-1'
	},
	{
		id: 'texp-10',
		description: 'Internet',
		amount: 40,
		userId: 'user-2',
		ledgerId: 'ledger-1',
		categoryId: 'cat-1'
	}
];

export const mockCategories: Category[] = [
	{ id: 'cat-1', name: 'Housing' },
	{ id: 'cat-2', name: 'Groceries' },
	{ id: 'cat-3', name: 'Leisure' },
	{ id: 'cat-4', name: 'Other' }
];

export const mockKeywords = [
	{ id: 'kw-1', name: 'Rent', categoryId: 'cat-1' },
	{ id: 'kw-2', name: 'Eneco', categoryId: 'cat-1' },
	{ id: 'kw-3', name: 'Water', categoryId: 'cat-1' },
	{ id: 'kw-4', name: 'Internet', categoryId: 'cat-1' },
	{ id: 'kw-5', name: 'AH', categoryId: 'cat-2' },
	{ id: 'kw-6', name: 'Lidl', categoryId: 'cat-2' },
	{ id: 'kw-7', name: 'Oriental', categoryId: 'cat-2' },
	{ id: 'kw-8', name: 'Dinner', categoryId: 'cat-3' },
	{ id: 'kw-9', name: 'Lunch', categoryId: 'cat-3' },
	{ id: 'kw-10', name: 'Trip', categoryId: 'cat-3' },
	{ id: 'kw-11', name: 'Date', categoryId: 'cat-3' },
	{ id: 'kw-12', name: 'Bol', categoryId: 'cat-4' },
	{ id: 'kw-13', name: 'Amazon', categoryId: 'cat-4' }
];
