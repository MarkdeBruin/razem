export type User = {
	id: string;
	name: string;
  email: string;
	role: 'admin' | 'partner'
};

export type Ledger = {
	id: string;
	name: string;
	adminFraction: number; // fraction paid by admin (0–1)
};

export type Bill = {
	id: string;
	description: string;
	amount: number;
	userId: string;
	ledgerId: string;
};

export type LedgerTemplate = {
	id: string;
	name: string;
	adminFraction: number; // fraction paid by admin (0–1)
	bills?: Bill[];
};
