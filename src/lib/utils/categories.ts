import type { Keyword } from "$lib/schemas/category";

function normaliseKeyword(keyword: string): string {
    return keyword.trim().toLowerCase();
}

export function matchCategory(input: string, keywords: Keyword[], excludeId?: string): string {
    const normalised = normaliseKeyword(input);
    const match = keywords
        .filter(k => k.id !== excludeId)
        .find(k => normalised === normaliseKeyword(k.name));
    return match?.categoryId ?? '';
}

export function keywordExists(name: string, keywords: Keyword[], excludeId?: string): boolean {
    const normalised = normaliseKeyword(name);
    return keywords
        .filter(k => k.id !== excludeId)
        .some(k => normalised === normaliseKeyword(k.name));
}