import type { Keyword } from "$lib/types";

function normaliseKeyword(keyword: string): string {
    return keyword.trim().toLowerCase();
}

export function matchCategory(input: string, keywords: Keyword[]): string {
    const normalised = normaliseKeyword(input);
    const match = keywords.find((keyword) => normalised === normaliseKeyword(keyword.name));
    return match?.categoryId ?? '';
}

export function keywordExists(name: string, keywords: Keyword[]): boolean {
    const normalised = normaliseKeyword(name);
    return keywords.some((keyword) => normalised === normaliseKeyword(keyword.name));
}