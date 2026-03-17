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

export type Bill = {
	id: string;
	description: string;
	amount: number;
	userId: string;
	ledgerId: string;
};

export type TemplateBill = {
	id: string;
	description: string;
	amount: number;
  userId: string;
};

export type LedgerTemplate = {
	id: string;
	name: string;
	ownerFraction: number; // fraction paid by owner (0–1)
	bills: TemplateBill[];
};
