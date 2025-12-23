import type { User, Stoppage, Shift } from './types';

export const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'user@example.com',
    enrollmentId: 'E123456',
    department: 'Computer Science',
  },
];

export const stoppages: Record<Shift, Stoppage[]> = {
  Morning: [
    { id: 'm1', name: 'Central Station', route: 'Route A' },
    { id: 'm2', name: 'Downtown Square', route: 'Route A' },
    { id: 'm3', name: 'University Campus', route: 'Route B' },
    { id: 'm4', name: 'Tech Park', route: 'Route B' },
  ],
  Evening: [
    { id: 'e1', name: 'Central Station', route: 'Route A' },
    { id: 'e2', name: 'City Library', route: 'Route C' },
    { id: 'e3', name: 'Eastwood Plaza', route: 'Route C' },
    { id: 'e4', name: 'University Campus', route: 'Route B' },
  ],
  Night: [
    { id: 'n1', name: 'Central Station', route: 'Route A' },
    { id: 'n2', name: 'Hospital Junction', route: 'Route D' },
    { id: 'n3', name: 'Airport', route: 'Route D' },
  ],
};

export const findUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email === email);
};

export const findUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

export const getStoppagesByShift = (shift: Shift): Stoppage[] => {
  return stoppages[shift] || [];
};

export const getStoppageById = (id: string): Stoppage | undefined => {
  for (const shift in stoppages) {
    const found = stoppages[shift as Shift].find(s => s.id === id);
    if (found) return found;
  }
  return undefined;
};
