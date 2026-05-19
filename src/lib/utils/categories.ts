import type { Keyword } from "$lib/types";

export function matchCategory(input: string, keywords: Keyword[]): string {
    const normalised = input.toLowerCase();
    const match = keywords.find((keyword) => normalised.includes(keyword.name.toLowerCase()));
    return match?.categoryId ?? '';
}