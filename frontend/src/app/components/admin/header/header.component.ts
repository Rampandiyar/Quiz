import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../../../service/admin.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  adminService = inject(AdminService);
  router = inject(Router);
  isLoggedIn: boolean = false;
  adminName: string = ''; // To store the retrieved admin name
  inactivityTimer: any; // To track inactivity timeout
  readonly inactivityLimit = 5 * 60 * 1000; // 5 minutes in milliseconds

  ngOnInit(): void {
    // Check if admin_id exists in local storage
    const adminId = localStorage.getItem('admin_id');
    if (!adminId) {
      this.router.navigate(['adlogin']);
      return;
    }

    // Validate the admin session by making a backend call
    this.adminService.getAdminService(adminId).subscribe({
      next: (response) => {
        if (response && response.data && response.data.name) {
          this.adminName = response.data.name;
          this.isLoggedIn = true;
        } else {
          this.logout();
        }
      },
      error: (err) => {
        console.error('Error fetching admin details', err);
        this.logout();
      },
    });

    this.adminService.isLoggedIn$.subscribe((res) => {
      this.isLoggedIn = this.adminService.isLoggedIn();
    });

    // Start the inactivity timer
    this.resetInactivityTimer();

    // Add event listeners for user activity
    window.addEventListener('mousemove', this.resetInactivityTimer.bind(this));
    window.addEventListener('keydown', this.resetInactivityTimer.bind(this));
  }

  ngOnDestroy(): void {
    // Clear the inactivity timer
    clearTimeout(this.inactivityTimer);

    // Remove event listeners for user activity
    window.removeEventListener('mousemove', this.resetInactivityTimer.bind(this));
    window.removeEventListener('keydown', this.resetInactivityTimer.bind(this));
  }

  // Reset inactivity timer on any user activity
  resetInactivityTimer() {
    clearTimeout(this.inactivityTimer);
    this.inactivityTimer = setTimeout(() => this.logoutDueToInactivity(), this.inactivityLimit);
  }

  // Logout due to inactivity
  logoutDueToInactivity() {
    alert('You have been logged out due to inactivity.');
    this.logout();
  }

  logout() {
    this.adminService.logoutService().subscribe(
      () => {
        localStorage.removeItem('admin_id');
        localStorage.clear();
        this.adminService.isLoggedIn$.next(false);
        this.router.navigate(['adlogin']);
      },
      (error) => {
        console.error('Logout failed', error);
      }
    );
  }

  clearLocalStorageAndLogout() {
    localStorage.removeItem('admin_id');
    this.adminService.isLoggedIn$.next(false);
  }

  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
