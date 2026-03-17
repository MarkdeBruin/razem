export type User = {
  id: string;
  name: string;
  email: string;
};

export type Ledger = {
	id: string;
	name: string;
	ownerFraction: number; // fraction paid by owner (0–1)
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
	ownerFraction: number; // fraction paid by owner (0–1)
	bills?: Bill[];
};
