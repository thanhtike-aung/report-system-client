export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthInitialState {
  isAuthenticated: boolean;
  authToken: string | null;
}

export interface ErrorResponse {
  message: string;
  status: number;
}

export interface ChangePasswordRequest {
  userId: number;
  oldPassword: string;
  newPassword: string;
}
