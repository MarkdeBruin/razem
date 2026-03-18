export function notFoundError(entity: string, id: string): Error {
	return new Error(`${entity} with id "${id}" not found`);
}