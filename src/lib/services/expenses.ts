import type { TablesDB } from 'node-appwrite';
import { Query, Permission, Role, ID, type Models } from 'node-appwrite';
import type { Expense, NewExpense } from '$lib/schemas/expenses';
import { notFoundError } from '$lib/utils/errors';
import { DB_ID } from '$env/static/private';

const TABLE_ID = 'expenses';

export type ExpenseRow = Models.Row & {
	teamId: string;
	ledgerId: string | Models.Row; // string when not expanded, object when Query.select expands it
	description: string;
	amount: number;
	userId: string;
	categoryId: string;
};

export function toExpense(row: ExpenseRow, knownLedgerId?: string): Expense {
	return {
		id: row.$id,
		teamId: row.teamId,
		ledgerId: knownLedgerId ?? (typeof row.ledgerId === 'string' ? row.ledgerId : row.ledgerId.$id),
		description: row.description,
		amount: row.amount,
		userId: row.userId,
		categoryId: row.categoryId
	};
}

export async function getAllExpenses(
	tablesDB: TablesDB,
	ledgerId: string,
	teamId: string
): Promise<Expense[]> {
	const { rows } = await tablesDB.listRows<ExpenseRow>({
		databaseId: DB_ID,
		tableId: TABLE_ID,
		queries: [
			Query.equal('teamId', teamId),
			Query.equal('ledgerId', ledgerId),
			Query.orderAsc('$createdAt'),
			Query.limit(999)
		]
	});
	return rows.map((row) => toExpense(row));
}

export async function getExpense(tablesDB: TablesDB, id: string, teamId: string): Promise<Expense> {
	let row: ExpenseRow;
	try {
		row = await tablesDB.getRow<ExpenseRow>({ databaseId: DB_ID, tableId: TABLE_ID, rowId: id });
	} catch {
		throw notFoundError('Expense', id);
	}
	if (row.teamId !== teamId) {
		throw notFoundError('Expense', id);
	}
	return toExpense(row);
}

export async function createExpense(tablesDB: TablesDB, expense: NewExpense): Promise<Expense> {
	const row = await tablesDB.createRow<ExpenseRow>({
		databaseId: DB_ID,
		tableId: TABLE_ID,
		rowId: ID.unique(),
		data: expense,
		permissions: [
			Permission.read(Role.team(expense.teamId)),
			Permission.update(Role.team(expense.teamId)),
			Permission.delete(Role.team(expense.teamId))
		]
	});
	return toExpense(row);
}

export async function updateExpense(
	tablesDB: TablesDB,
	id: string,
	teamId: string,
	data: NewExpense
): Promise<Expense> {
	const existing = await tablesDB
		.getRow<ExpenseRow>({ databaseId: DB_ID, tableId: TABLE_ID, rowId: id })
		.catch(() => null);
	if (!existing || existing.teamId !== teamId) {
		throw notFoundError('Expense', id);
	}

	const row = await tablesDB.updateRow<ExpenseRow>({
		databaseId: DB_ID,
		tableId: TABLE_ID,
		rowId: id,
		data
	});
	return toExpense(row);
}

export async function deleteExpense(tablesDB: TablesDB, id: string, teamId: string): Promise<void> {
	const existing = await tablesDB
		.getRow<ExpenseRow>({ databaseId: DB_ID, tableId: TABLE_ID, rowId: id })
		.catch(() => null);
	if (!existing || existing.teamId !== teamId) {
		throw notFoundError('Expense', id);
	}
	await tablesDB.deleteRow({ databaseId: DB_ID, tableId: TABLE_ID, rowId: id });
}
