import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  register(userData: any): boolean {
    if (isPlatformBrowser(this.platformId)) {
      // Simulate database by storing users in an array in localStorage
      let users = [];
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        users = JSON.parse(storedUsers);
      }
      
      // Check if email already exists
      const exists = users.find((u: any) => u.email === userData.email);
      if (exists) {
        return false; // Registration failed (email exists)
      }

      users.push(userData);
      localStorage.setItem('users', JSON.stringify(users));
      return true;
    }
    return false;
  }

  login(credentials: any): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const user = users.find((u: any) => u.email === credentials.email && u.password === credentials.password);
        
        if (user) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.router.navigate(['/dashboard']);
          return true;
        }
      }
    }
    return false;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('currentUser');
    }
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('isLoggedIn') === 'true';
    }
    // Allow rendering on server side so it doesn't force a redirect. 
    // The client will run the guard again and redirect if actually logged out.
    return true;
  }
}
