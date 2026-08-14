import type { TablesDB } from 'node-appwrite';
import { Query, Permission, Role, ID, type Models } from 'node-appwrite';
import type { Category, Keyword, NewKeyword } from '$lib/schemas/category';
import { notFoundError } from '$lib/utils/errors';
import { DB_ID } from '$env/static/private';

const CATEGORIES_TABLE_ID = 'categories';
const KEYWORDS_TABLE_ID = 'keywords';

type CategoryRow = Models.Row & {
	name: string;
	teamId: string;
	keywords?: (string | KeywordRow)[]; // present on read (expanded query only), never on write
};

type KeywordRow = Models.Row & {
	name: string;
	categoryId: string | CategoryRow;
	teamId: string;
};

function toCategory(row: CategoryRow): Category {
	return { id: row.$id, name: row.name, teamId: row.teamId };
}

function toKeyword(row: KeywordRow, knownCategoryId?: string): Keyword {
	return {
		id: row.$id,
		name: row.name,
		categoryId:
			knownCategoryId ?? (typeof row.categoryId === 'string' ? row.categoryId : row.categoryId.$id),
		teamId: row.teamId
	};
}

export async function getAllCategories(tablesDB: TablesDB, teamId: string): Promise<Category[]> {
	const { rows } = await tablesDB.listRows<CategoryRow>({
		databaseId: DB_ID,
		tableId: CATEGORIES_TABLE_ID,
		queries: [Query.equal('teamId', teamId), Query.orderAsc('name'), Query.limit(999)]
	});
	return rows.map(toCategory);
}

export async function getAllCategoriesAndKeywords(
	tablesDB: TablesDB,
	teamId: string
): Promise<{ categories: Category[]; keywords: Keyword[] }> {
	const { rows } = await tablesDB.listRows<CategoryRow>({
		databaseId: DB_ID,
		tableId: CATEGORIES_TABLE_ID,
		queries: [
			Query.equal('teamId', teamId),
			Query.orderAsc('name'),
			Query.limit(999),
			Query.select(['*', 'keywords.*'])
		]
	});

	const categories = rows.map(toCategory);
	const keywords = rows.flatMap((row) => {
		const keywordRows = (row.keywords ?? []) as KeywordRow[];
		return keywordRows.map((kwRow) => toKeyword(kwRow, row.$id));
	});
	keywords.sort((a, b) => a.name.localeCompare(b.name));

	return { categories, keywords };
}

export async function getKeyword(tablesDB: TablesDB, id: string, teamId: string): Promise<Keyword> {
	let row: KeywordRow;
	try {
		row = await tablesDB.getRow<KeywordRow>({
			databaseId: DB_ID,
			tableId: KEYWORDS_TABLE_ID,
			rowId: id
		});
	} catch {
		throw notFoundError('Keyword', id);
	}
	if (row.teamId !== teamId) {
		throw notFoundError('Keyword', id);
	}
	return toKeyword(row);
}

export async function createKeyword(tablesDB: TablesDB, keyword: NewKeyword): Promise<Keyword> {
	const { rows: existing } = await tablesDB.listRows<KeywordRow>({
		databaseId: DB_ID,
		tableId: KEYWORDS_TABLE_ID,
		queries: [Query.equal('teamId', keyword.teamId), Query.limit(999)]
	});
	const duplicate = existing.find((row) => row.name.toLowerCase() === keyword.name.toLowerCase());
	if (duplicate) throw new Error(`Keyword "${keyword.name}" already exists`);

	const row = await tablesDB.createRow<KeywordRow>({
		databaseId: DB_ID,
		tableId: KEYWORDS_TABLE_ID,
		rowId: ID.unique(),
		data: keyword,
		permissions: [
			Permission.read(Role.team(keyword.teamId)),
			Permission.update(Role.team(keyword.teamId)),
			Permission.delete(Role.team(keyword.teamId))
		]
	});
	return toKeyword(row);
}

export async function updateKeyword(
	tablesDB: TablesDB,
	id: string,
	teamId: string,
	data: NewKeyword
): Promise<Keyword> {
	const existing = await tablesDB
		.getRow<KeywordRow>({ databaseId: DB_ID, tableId: KEYWORDS_TABLE_ID, rowId: id })
		.catch(() => null);
	if (!existing || existing.teamId !== teamId) {
		throw notFoundError('Keyword', id);
	}
	const row = await tablesDB.updateRow<KeywordRow>({
		databaseId: DB_ID,
		tableId: KEYWORDS_TABLE_ID,
		rowId: id,
		data
	});
	return toKeyword(row);
}

export async function deleteKeyword(tablesDB: TablesDB, id: string, teamId: string): Promise<void> {
	const existing = await tablesDB
		.getRow<KeywordRow>({ databaseId: DB_ID, tableId: KEYWORDS_TABLE_ID, rowId: id })
		.catch(() => null);
	if (!existing || existing.teamId !== teamId) {
		throw notFoundError('Keyword', id);
	}
	await tablesDB.deleteRow({ databaseId: DB_ID, tableId: KEYWORDS_TABLE_ID, rowId: id });
}

export async function keywordNameExists(
	tablesDB: TablesDB,
	name: string,
	teamId: string,
	excludeId?: string
): Promise<boolean> {
	const { rows } = await tablesDB.listRows<KeywordRow>({
		databaseId: DB_ID,
		tableId: KEYWORDS_TABLE_ID,
		queries: [Query.equal('teamId', teamId), Query.limit(999)]
	});
	return rows.some((row) => row.name.toLowerCase() === name.toLowerCase() && row.$id !== excludeId);
}
