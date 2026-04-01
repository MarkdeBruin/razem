import type { Category } from "$lib/types";

export function matchCategory(input: string, categories: Category[]): string {
		const normalised = input.toLowerCase();
		const match = categories.find((category) =>
			category.keywords.some((keyword) => normalised.includes(keyword.toLowerCase()))
		);
		return match?.id ?? '';
	}