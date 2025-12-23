import type { User, Stoppage, Shift } from './types';

export const users: User[] = [
  {
    id: '729dcec1-d2d5-4400-9eb9-b68d160a56d8',
    name: 'John Doe',
    email: 'user@example.com',
    enrollmentId: 'E123456',
    department: 'Computer Science',
  },
];

// This mock data is no longer the primary source on the shift-selection page
// but is kept for reference and for the confirmation page.
export const mockStoppages: Stoppage[] = [
    { id: 3, name: 'Akabar Pur' },
    { id: 4, name: 'Anand Van' },
    { id: 5, name: 'Atalla Chungi' },
];

export const findUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email === email);
};

export const findUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

export const getStoppageById = (id: string): Stoppage | undefined => {
  // This function might need to be updated depending on how stoppages are fetched/stored globally
  return mockStoppages.find(s => s.id.toString() === id);
};
