export interface AuthUser {
  id: number;
  alias: string;
  email: string;
  name?: string | null;
  emailVerified?: boolean;
  updatedAt?: string;
  avatarUrl?: string | null;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface AuthUserStats {
  assigned: number;
  done: number;
  pending: number;
  completion: number;
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
  avatarUrl?: string | null;
}

const FALLBACK_COLOR = '#2563eb';
const AVATAR_COLORS = ['#2563eb'];

function stableHash(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return hash;
}

export function getAvatarInitial(user: Pick<AuthUser, 'name' | 'alias'> | null | undefined): string {
  const source = (user?.name ?? user?.alias ?? '').trim();
  if (!source) {
    return '?';
  }
  return source[0]?.toUpperCase() || '?';
}

export function getAvatarColor(user: Pick<AuthUser, 'alias' | 'email'> | null | undefined): string {
  const key = (user?.alias || user?.email || '').trim();
  if (!key) {
    return FALLBACK_COLOR;
  }
  const index = Math.abs(stableHash(key)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index] ?? FALLBACK_COLOR;
}
