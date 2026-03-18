import type { User, Ledger, Expense, LedgerTemplate } from '$lib/types';

export const mockUsers: User[] = [
	{ id: 'user-1', name: 'Mark', email: 'mark@example.com', role: 'owner' },
	{ id: 'user-2', name: 'Anna', email: 'anna@example.com', role: 'partner' }
];

export const mockLedgers: Ledger[] = [
	{ id: 'ledger-1', name: 'March 2026', ownerFraction: 0.5 },
	{ id: 'ledger-2', name: 'February 2026', ownerFraction: 0.5 }
];

export const mockExpenses: Expense[] = [
	{ id: 'exp-1', description: 'Rent', amount: 1200, userId: 'user-1', ledgerId: 'ledger-1' },
	{ id: 'exp-2', description: 'Groceries', amount: 150, userId: 'user-1', ledgerId: 'ledger-1' },
	{ id: 'exp-3', description: 'Utilities', amount: 80, userId: 'user-1', ledgerId: 'ledger-1' },
  { id: 'exp-4', description: 'Internet', amount: 40, userId: 'user-1', ledgerId: 'ledger-1' },
	{ id: 'exp-5', description: 'AH', amount: 20, userId: 'user-2', ledgerId: 'ledger-1' },
	{ id: 'exp-6', description: 'Rent', amount: 1200, userId: 'user-1', ledgerId: 'ledger-2' },
	{ id: 'exp-7', description: 'Groceries', amount: 130, userId: 'user-2', ledgerId: 'ledger-2' }
];

export const mockTemplates: LedgerTemplate[] = [
	{
		id: 'template-1',
		name: 'Monthly',
		ownerFraction: 0.5,
		expenses: [
			{ id: 'texp-1', description: 'Rent', amount: 1200, userId: 'user-1' },
			{ id: 'texp-2', description: 'Utilities', amount: 80, userId: 'user-1' },
			{ id: 'texp-3', description: 'Internet', amount: 40, userId: 'user-2' }
		]
	}
];
