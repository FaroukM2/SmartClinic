export interface User {
  id: string;
  fullName: string;
  email: string;
  userType: string;
  clinicId: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  clinicId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  userType: number;
}
