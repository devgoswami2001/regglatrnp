export type User = {
  id: string;
  name: string;
  email: string; // Kept for OTP page context, may not be available on shift page
  enrollmentId: string;
  department: string;
};

export type FetchedUser = {
  first_name: string;
  last_name: string;
  employee_id: string;
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
