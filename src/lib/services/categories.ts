import type { Category, Keyword, NewKeyword } from '$lib/schemas/category';
import { notFoundError } from '$lib/utils/errors';
import { mockCategories, mockKeywords } from '$lib/mock/data';

export async function getAllCategories(): Promise<Category[]> {
	return mockCategories;
}

export async function getAllKeywords(): Promise<Keyword[]> {
	const keywords = mockKeywords;
	return keywords.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getKeyword(id: string): Promise<Keyword | undefined> {
	return mockKeywords.find((keyword) => keyword.id === id);
}

export async function createKeyword(keyword: NewKeyword): Promise<Keyword> {
	const duplicate = mockKeywords.find(
		(existingKeyword) => existingKeyword.name.toLowerCase() === keyword.name.toLowerCase()
	);

	if (duplicate) throw new Error(`Keyword "${keyword.name}" already exists`);

	const newKeyword: Keyword = { ...keyword, id: `kw-${crypto.randomUUID()}` };
	mockKeywords.push(newKeyword);

	return newKeyword;
}

export async function updateKeyword(id: string, data: NewKeyword): Promise<Keyword> {
	const index = mockKeywords.findIndex((keyword) => keyword.id === id);

	if (index === -1) throw notFoundError('Keyword', id);

	const updatedKeyword: Keyword = { ...data, id };
	mockKeywords[index] = updatedKeyword;

	return updatedKeyword;
}

export async function deleteKeyword(id: string): Promise<void> {
	const index = mockKeywords.findIndex((keyword) => keyword.id === id);

	if (index === -1) throw notFoundError('Keyword', id);

	mockKeywords.splice(index, 1);
}
