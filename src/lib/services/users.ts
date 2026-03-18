import type { User } from '$lib/types';
import { notFoundError } from '$lib/utils/errors';

import { mockUsers } from '$lib/mock/data';

export async function getOwner(): Promise<User> {
	const owner = mockUsers.find((user) => user.role === 'owner');

	if (!owner) throw notFoundError('Owner');

	return owner;
}

export async function getPartner(): Promise<User> {
	const partner = mockUsers.find((user) => user.role === 'partner');

	if (!partner) throw notFoundError('Partner');

	return partner;
}
