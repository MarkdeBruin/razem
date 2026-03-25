import type { Category } from '$lib/types';
import { mockCategories } from '$lib/mock/data';
import { notFoundError } from '$lib/utils/errors';

export async function getAllCategories(): Promise<Category[]> {
	return mockCategories;
}

export async function getAllKeywords(): Promise<string[]> {
	return mockCategories.flatMap((category) => category.keywords);
}

export async function addKeyword(rawKeyword: string, categoryId: string): Promise<Category> {
	const keyword = rawKeyword.trim().replace(/^\w/, c => c.toUpperCase())

	const allKeywords = await getAllKeywords();
	if (allKeywords.includes(keyword)) throw new Error(`Keyword "${keyword}" already exists`);

	const category = mockCategories.find((category) => category.id === categoryId);
	if (!category) throw notFoundError('Expese category', categoryId);

  category.keywords.push(keyword);
	
	return category;
}
