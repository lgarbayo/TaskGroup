import { Injectable, WritableSignal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, AuthUser, AuthUserStats, LoginCommand, RegisterCommand, UpdateProfileCommand } from '../model/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authUrl = '/api/auth';
  private readonly tokenStorageKey = 'taskgroup_token';
  private readonly userStorageKey = 'taskgroup_user';
  private readonly http: HttpClient;
  private readonly tokenSignal: WritableSignal<string | null> = signal<string | null>(null);
  private readonly userSignal: WritableSignal<AuthUser | null> = signal<AuthUser | null>(null);

  constructor(http: HttpClient) {
    this.http = http;
    this.tokenSignal.set(this.getStoredToken());
    this.userSignal.set(this.getStoredUser());
  }

  readonly token = this.tokenSignal.asReadonly();
  readonly user = this.userSignal.asReadonly();

  login(command: LoginCommand): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/login`, command).pipe(
      tap((response) => this.persistAuth(response))
    );
  }

  register(command: RegisterCommand): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/register`, command).pipe(
      tap((response) => this.persistAuth(response))
    );
  }

  uploadAvatar(file: File): Observable<AuthUser> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post<AuthUser>(`${this.authUrl}/avatar`, formData).pipe(
      tap((user) => this.persistUser(user))
    );
  }

  updateProfile(command: UpdateProfileCommand): Observable<AuthUser> {
    return this.http.put<AuthUser>(`${this.authUrl}/me`, command).pipe(
      tap((user) => this.persistUser(user))
    );
  }

  getUserStats(): Observable<AuthUserStats> {
    return this.http.get<AuthUserStats>(`${this.authUrl}/stats`);
  }

  logout(): void {
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    this.getStorage()?.removeItem(this.tokenStorageKey);
    this.getStorage()?.removeItem(this.userStorageKey);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  private persistAuth(response: AuthResponse): void {
    this.tokenSignal.set(response.token);
    this.userSignal.set(response.user);
    this.getStorage()?.setItem(this.tokenStorageKey, response.token);
    this.getStorage()?.setItem(this.userStorageKey, JSON.stringify(response.user));
  }

  private persistUser(user: AuthUser): void {
    this.userSignal.set(user);
    this.getStorage()?.setItem(this.userStorageKey, JSON.stringify(user));
  }

  private getStoredToken(): string | null {
    return this.getStorage()?.getItem(this.tokenStorageKey) ?? null;
  }

  private getStoredUser(): AuthUser | null {
    const raw = this.getStorage()?.getItem(this.userStorageKey);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      this.getStorage()?.removeItem(this.userStorageKey);
      return null;
    }
  }

  private getStorage(): Storage | null {
    return typeof window === 'undefined' ? null : window.localStorage;
  }
}
