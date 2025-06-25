export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  avatar: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface LoginResponse {
  token: string;
  user: User;
}
