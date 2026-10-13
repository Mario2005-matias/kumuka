export type UserRole = 'student';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
}
