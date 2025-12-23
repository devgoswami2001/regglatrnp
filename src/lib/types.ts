export type User = {
  id: string;
  name: string;
  email: string;
  enrollmentId: string;
  department: string;
};

export type Shift = 'Morning' | 'Evening' | 'Night';

export const shifts: Shift[] = ['Morning', 'Evening', 'Night'];

export type Stoppage = {
  id: string;
  name: string;
  route: string;
};
