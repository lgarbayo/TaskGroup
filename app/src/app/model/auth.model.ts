export interface AuthUser {
  id: number;
  alias: string;
  email: string;
  name?: string | null;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface LoginCommand {
  email: string;
  password: string;
}

export interface RegisterCommand {
  alias: string;
  email: string;
  password: string;
  name?: string;
}

export interface UpdateProfileCommand {
  alias: string;
  name?: string | null;
}
