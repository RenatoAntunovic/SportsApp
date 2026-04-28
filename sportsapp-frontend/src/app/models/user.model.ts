export interface User {
  id?: number;
  username: string;
  email: string;
  role?: string;
  createdAt?: string;
}

export interface UserUpdate {
  username?: string;
  email?: string;
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
}