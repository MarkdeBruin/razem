import type { ExpenseCategory } from "$lib/types";
import { mockCategories } from "$lib/mock/data";

export async function getExpenseCategories(): Promise<ExpenseCategory[]> {
	return mockCategories;
}

export async function getExpenseCategory(id: string): Promise<ExpenseCategory | undefined> {
	return mockCategories.find((category) => category.id === id);
}