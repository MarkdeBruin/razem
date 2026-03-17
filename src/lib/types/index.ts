export type User = {
	id: string;
	name: string;
	email: string;
	role: 'owner' | 'partner';
};

export type Ledger = {
	id: string;
	name: string;
	ownerFraction: number; // Partner’s fraction = 1 - ownerFraction
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
	ownerFraction: number; // Partner’s fraction = 1 - ownerFraction
	bills?: Bill[];
};
