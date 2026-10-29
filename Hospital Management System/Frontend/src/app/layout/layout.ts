import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class LayoutComponent {
  authService = inject(AuthService);
  router = inject(Router);

  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.authService.logout();
  }

  onSearch(query: string) {
    const q = query.toLowerCase().trim();
    if (!q) return;

    if (q === 'completed appointment' || q === 'completed appointments' || q === 'completed') {
      this.router.navigate(['/dashboard/Completed']);
    } else if (q === 'appointment' || q === 'appointments') {
      this.router.navigate(['/dashboard/AppointMents']);
    } else if (q === 'doctor' || q === 'doctors') {
      this.router.navigate(['/dashboard/Doctor']);
    } else if (q === 'patient' || q === 'patients') {
      this.router.navigate(['/dashboard/Patient']);
    } else if (q === 'medical store' || q === 'store' || q === 'medicine') {
      this.router.navigate(['/dashboard/MedicalStore']);
    } else if (q === 'dashboard' || q === 'home') {
      this.router.navigate(['/dashboard']);
    }
  }
}
