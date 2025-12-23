import type { User, Stoppage, Shift } from './types';

// This data is kept for context but is now superseded by API calls on the relevant pages.
export const users: User[] = [
  {
    id: '729dcec1-d2d5-4400-9eb9-b68d160a56d8',
    name: 'John Doe',
    email: 'user@example.com',
    enrollmentId: 'E123456',
    department: 'Computer Science',
  },
];

export const mockStoppages: Stoppage[] = [
    { id: 3, name: 'Akabar Pur' },
    { id: 4, name: 'Anand Van' },
    { id: 5, name: 'Atalla Chungi' },
];

export const findUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

export const getStoppageById = (id: string): Stoppage | undefined => {
  return mockStoppages.find(s => s.id.toString() === id);
};
