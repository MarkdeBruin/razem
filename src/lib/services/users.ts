import type { User } from '$lib/types';

import { mockUsers } from '$lib/mock/data';

export async function getUsers(): Promise<User[]> {
  return mockUsers;
}
