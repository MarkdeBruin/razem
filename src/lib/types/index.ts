export type User = {
	id: string;
	name: string;
	email: string;
	role: 'owner' | 'partner';
};

export type Ledger = {
	id: string;
	name: string;
	ownerFraction: number; // fraction paid by owner (0–1)
};
export type NewLedger = Omit<Ledger, 'id'>;

export type Expense = {
	id: string;
	description: string;
	amount: number;
	userId: string;
	ledgerId: string;
};
export type NewExpense = Omit<Expense, 'id'>;

export type TemplateExpense = {
	id: string;
	description: string;
	amount: number;
	userId: string;
};
export type NewTemplateExpense = Omit<TemplateExpense, 'id'>;

export type LedgerTemplate = {
	id: string;
	name: string;
	ownerFraction: number; // fraction paid by owner (0–1)
	expenses: TemplateExpense[];
};
export type NewLedgerTemplate = Omit<LedgerTemplate, 'id'>;

export type ExpenseCategory = {
  id: string;
  name: string;
  keywords: string[];
}

export type NewExpenseCategory = Omit<ExpenseCategory, 'id'>;