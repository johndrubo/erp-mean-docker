import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  public currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();
  private tokenKey = 'erp_token';

  constructor(private http: HttpClient) {
    // Check if user is logged in on service initialization
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.getCurrentUser().subscribe();
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const response = await this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password }).toPromise();
      if (response) {
        localStorage.setItem(this.tokenKey, response.token);
        this.currentUserSubject.next(response.user);
      }
    } catch (error) {
      throw error;
    }
  }

  async register(userData: { name: string; email: string; password: string; role: string }): Promise<void> {
    try {
      const response = await this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, userData).toPromise();
      if (response) {
        localStorage.setItem(this.tokenKey, response.token);
        this.currentUserSubject.next(response.user);
      }
    } catch (error) {
      throw error;
    }
  }

  getCurrentUser(): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.get<User>(`${this.apiUrl}/auth/me`, { headers }).pipe(
      tap(user => this.currentUserSubject.next(user)),
      catchError(error => {
        this.logout();
        return throwError(error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
