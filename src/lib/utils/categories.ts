import type { Keyword } from "$lib/types";

export function matchCategory(input: string, keywords: Keyword[]): string {
    const normalised = input.trim().toLowerCase();
    const match = keywords.find((keyword) => normalised === keyword.name.trim().toLowerCase());
    return match?.categoryId ?? '';
}
