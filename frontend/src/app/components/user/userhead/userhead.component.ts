import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AdminService } from '../../../service/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userhead',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './userhead.component.html',
  styleUrls: ['./userhead.component.css']
})
export class UserheadComponent implements OnInit, OnDestroy {
  adminService = inject(AdminService);
  router = inject(Router);
  isLoggedIn: boolean = false;
  userName: string = ''; // To store the retrieved user/admin name
  inactivityTimer: any; // To track inactivity timeout
  readonly inactivityLimit = 5 * 60 * 1000; // 5 minutes in milliseconds
  menuOpen = false;

  ngOnInit(): void {
    // Check if user_id exists in local storage
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      this.router.navigate(['uslogin']);
      return;
    }

    // Validate the user session by making a backend call
    this.adminService.getUserService(userId).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.userName = response.data.name; // Ensure response data has name
          this.isLoggedIn = true;
          this.router.navigate(['/userdash'], { replaceUrl: true }); // Replace login URL in history
        } else {
          this.logout();
        }
      },
      error: (err) => {
        console.error('Error fetching user details', err);
        this.logout();
      },
    });

    // Listen for login status changes
    this.adminService.isLoggedIn$.subscribe(() => {
      this.isLoggedIn = this.adminService.isLoggedIn();
    });

    // Start the inactivity timer
    this.resetInactivityTimer();

    // Add event listeners for user activity
    window.addEventListener('mousemove', this.resetInactivityTimer.bind(this));
    window.addEventListener('keydown', this.resetInactivityTimer.bind(this));

    // REMOVE THIS:
    // window.onbeforeunload = () => {
    //   this.clearLocalStorageAndLogout();
    // };
  }

  ngOnDestroy(): void {
    // Cleanup on destroy
    clearTimeout(this.inactivityTimer);
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

  // Logout and clear session
  logout() {
    this.adminService.logoutService().subscribe(
      () => {
        localStorage.removeItem('user_id'); // Clear user_id from local storage
        localStorage.removeItem('token'); // Clear token from local storage
        this.adminService.isLoggedIn$.next(false);
        this.clearNavigationHistory(); // Clear navigation history on logout
        this.router.navigate(['/uslogin']); // Redirect to login page
      },
      (error) => {
        console.error('Logout failed', error);
      }
    );
  }

  // Clear localStorage and logout without API call (for page refresh)
  clearLocalStorageAndLogout() {
    localStorage.removeItem('user_id'); // Clear user_id
    localStorage.removeItem('token'); // Clear token
    this.adminService.isLoggedIn$.next(false);
  }

  // Clear navigation history
  clearNavigationHistory() {
    window.history.pushState(null, '', window.location.href); // Push current state to history
    window.onpopstate = function () {
      window.history.pushState(null, '', window.location.href); // Prevent going back
    };
  }

  // Toggle the hamburger menu
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
