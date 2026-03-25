import type { Ledger, NewLedger } from '$lib/types';
import { notFoundError } from '$lib/utils/errors';

import { mockLedgers } from '$lib/mock/data';

export async function getAllLedgers(): Promise<Ledger[]> {
	return mockLedgers;
}

export async function getLedger(id: string): Promise<Ledger | undefined> {
	return mockLedgers.find((ledger) => ledger.id === id);
}

export async function createLedger(ledger: NewLedger): Promise<Ledger> {
	const newLedger: Ledger = {
		...ledger,
		id: `ledger-${crypto.randomUUID()}`
	};

	mockLedgers.push(newLedger);

	return newLedger;
}

export async function updateLedger(id: string, data: NewLedger): Promise<Ledger> {
	const index = mockLedgers.findIndex((ledger) => ledger.id === id);

	if (index === -1) throw notFoundError('Ledger', id);

	const updatedLedger: Ledger = { ...data, id };
	mockLedgers[index] = updatedLedger;

	return mockLedgers[index];
}

export async function deleteLedger(id: string): Promise<void> {
	const index = mockLedgers.findIndex((ledger) => ledger.id === id);

	if (index === -1) throw notFoundError('Ledger', id);

	mockLedgers.splice(index, 1);
}
