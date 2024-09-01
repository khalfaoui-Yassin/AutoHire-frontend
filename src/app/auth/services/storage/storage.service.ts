import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem('token', token);
    }
  }

  saveUser(user: any): void {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem('user', JSON.stringify(user));
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return window.localStorage.getItem('token');
    }
    return null;
  }

  getUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      return JSON.parse(localStorage.getItem('user') || '{}');
    }
    return {};
  }

  getUserRole(): string {
    const user = this.getUser();
    return user ? user.role : '';
  }

  getUserId(): string {
    const user = this.getUser();
    return user ? user.id : '';
  }

  isAdminLoggedIn(): boolean {
    return this.getToken() !== null && this.getUserRole() === 'ADMIN';
  }

  isCustomerLoggedIn(): boolean {
    return this.getToken() !== null && this.getUserRole() === 'CUSTOMER';
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('user');
    }
  }
}
