import type { User } from '$lib/types';

import { mockUsers } from '$lib/mock/data';

export async function getBothUsers(): Promise<User[]> {
  return mockUsers;
}
