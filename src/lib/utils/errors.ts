export function notFoundError(entity: string, id?: string): Error {
  if (id) return new Error(`${entity} with id "${id}" not found`);
	
	return new Error(`${entity} not found`);
}
