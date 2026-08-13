import type { Models, TablesDB } from 'node-appwrite';
import { Query, Permission, Role, ID } from 'node-appwrite';
import type { Ledger, NewLedger } from '$lib/schemas/ledgers';
import { notFoundError } from '$lib/utils/errors';
import { DB_ID } from '$env/static/private';

const TABLE_ID = 'ledgers';

type LedgerRow = Models.Row & {
	teamId: string;
	name: string;
	ownerFraction: number;
	isTemplate: boolean;
};

function toLedger(row: LedgerRow): Ledger {
	return {
		id: row.$id,
		teamId: row.teamId,
		name: row.name,
		ownerFraction: row.ownerFraction,
		isTemplate: row.isTemplate
	};
}

export async function getAllLedgers(tablesDB: TablesDB, teamId: string): Promise<Ledger[]> {
	const { rows } = await tablesDB.listRows<LedgerRow>({
		databaseId: DB_ID,
		tableId: TABLE_ID,
		queries: [
			Query.equal('teamId', teamId),
      Query.orderDesc('$createdAt'),
			Query.limit(999)
		]
	});
	return rows.map(toLedger);
}

export async function getHomeLedgers(tablesDB: TablesDB, teamId: string): Promise<Ledger[]> {
	const { rows } = await tablesDB.listRows<LedgerRow>({
		databaseId: DB_ID,
		tableId: TABLE_ID,
		queries: [
			Query.equal('teamId', teamId),
      Query.orderDesc('$createdAt'),
			Query.limit(5)
		]
	});
	return rows.map(toLedger);
}

export async function getAllLedgerTemplates(tablesDB: TablesDB, teamId: string): Promise<Ledger[]> {
	const { rows } = await tablesDB.listRows<LedgerRow>({
		databaseId: DB_ID,
		tableId: TABLE_ID,
		queries: [
			Query.equal('teamId', teamId),
			Query.equal('isTemplate', true),
      Query.orderDesc('$createdAt'),
      Query.limit(999)
		]
	});
	return rows.map(toLedger);
}

export function splitLedgersAndTemplates(ledgers: Ledger[]): { ledgers: Ledger[]; templates: Ledger[] } {
	return {
		ledgers: ledgers.filter((ledger) => !ledger.isTemplate),
		templates: ledgers.filter((ledger) => ledger.isTemplate)
	};
}

export async function getLedger(tablesDB: TablesDB, id: string, teamId: string): Promise<Ledger> {
	let row: LedgerRow;
	try {
		row = await tablesDB.getRow({ databaseId: DB_ID, tableId: TABLE_ID, rowId: id });
	} catch {
		throw notFoundError('Ledger', id);
	}
	if (row.teamId !== teamId) {
		throw notFoundError('Ledger', id);
	}
	return toLedger(row);
}

export async function createLedger(tablesDB: TablesDB, ledger: NewLedger): Promise<Ledger> {
	const row = await tablesDB.createRow<LedgerRow>({
		databaseId: DB_ID,
		tableId: TABLE_ID,
		rowId: ID.unique(),
		data: ledger,
		permissions: [
			Permission.read(Role.team(ledger.teamId)),
			Permission.update(Role.team(ledger.teamId)),
			Permission.delete(Role.team(ledger.teamId))
		]
	});
	return toLedger(row);
}

export async function updateLedger(
	tablesDB: TablesDB,
	id: string,
	teamId: string,
	data: NewLedger
): Promise<Ledger> {
	const existing = await tablesDB.getRow<LedgerRow>({ databaseId: DB_ID, tableId: TABLE_ID, rowId: id }).catch(() => null);
	if (!existing || existing.teamId !== teamId) {
		throw notFoundError('Ledger', id);
	}

	const row = await tablesDB.updateRow<LedgerRow>({
		databaseId: DB_ID,
		tableId: TABLE_ID,
		rowId: id,
		data
	});
	return toLedger(row);
}

export async function deleteLedger(tablesDB: TablesDB, id: string, teamId: string): Promise<void> {
	const existing = await tablesDB.getRow<LedgerRow>({ databaseId: DB_ID, tableId: TABLE_ID, rowId: id }).catch(() => null);
	if (!existing || existing.teamId !== teamId) {
		throw notFoundError('Ledger', id);
	}

  await tablesDB.deleteRow({ databaseId: DB_ID, tableId: TABLE_ID, rowId: id });

  // Expenses are cleaned up via Appwrite relationship
}