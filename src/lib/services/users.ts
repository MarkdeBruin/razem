import type { User } from '$lib/schemas/users';

import { mockUsers } from '$lib/mock/data';

export async function getBothUsers(): Promise<User[]> {
  return mockUsers;
}
