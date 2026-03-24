import type { ExpenseCategory, NewExpenseCategory } from '$lib/types';
import { mockCategories } from '$lib/mock/data';
import { notFoundError } from '$lib/utils/errors';

export async function getExpenseCategories(): Promise<ExpenseCategory[]> {
	return mockCategories;
}

export async function getExpenseCategory(id: string): Promise<ExpenseCategory | undefined> {
	return mockCategories.find((category) => category.id === id);
}

export async function getAllKeywords(): Promise<string[]> {
	const set = new Set<string>();
	for (const category of mockCategories) {
		for (const keyword of category.keywords) {
			set.add(keyword.toLowerCase());
		}
	}
	return Array.from(set);
}

function normalizeKeyword(keyword: string) {
	return keyword
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[^\w\s]/gu, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

export async function updateExpenseCategory(
	id: string,
	data: ExpenseCategory
): Promise<ExpenseCategory> {
	const index = mockCategories.findIndex((category) => category.id === id);
	if (index === -1) throw notFoundError('Expense category', id);

	const keywords = Array.from(new Set((data.keywords ?? []).map(normalizeKeyword).filter(Boolean)));

	const updatedCatagory: ExpenseCategory = { ...data, id, keywords };
  mockCategories[index] = updatedCatagory;
	
	return updatedCatagory;
}
