export class NotFoundError extends Error {
	constructor(entity: string, id?: string) {
		super(id ? `${entity} with id "${id}" not found` : `${entity} not found`);
		this.name = 'NotFoundError';
	}
}

export function notFoundError(entity: string, id?: string): NotFoundError {
	return new NotFoundError(entity, id);
}
