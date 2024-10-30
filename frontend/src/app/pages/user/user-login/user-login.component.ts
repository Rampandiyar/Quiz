import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../service/admin.service';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export default class UserLoginComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  adminService = inject(AdminService); // Inject the AdminService

  loginForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = ''; // Add a success message field

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      rollno: ['', Validators.required], // User's roll number
      password: ['', Validators.required] // User's password
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill out the form correctly';
      return;
    }

    const loginData = this.loginForm.value;

    // Call the userLoginService from AdminService
    this.adminService.userLoginService(loginData).subscribe({
      next: (res) => {
        // Handle successful login
        localStorage.setItem('user_id', res.data._id); // Save user ID to local storage
        localStorage.setItem('user_details', JSON.stringify(res.data)); // Save user details

        // Optionally, store other user details if needed
        // Example: localStorage.setItem('user_name', res.data.name);

        this.successMessage = 'Login successful!'; // Set the success message
        this.errorMessage = ''; // Clear any error messages
        this.router.navigate(['userdash']); // Redirect to user dashboard
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Invalid credentials. Please try again.';
        this.successMessage = ''; // Clear any success message
      }
    });
  }
}
