export type User = {
  id: string;
  name: string;
  email: string;
  enrollmentId: string;
  department: string;
};

export type Shift = {
  id: number;
  time: string;
};

export type Stoppage = {
  id: number;
  name: string;
};
