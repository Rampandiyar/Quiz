import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../service/admin.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-adlogin',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './adlogin.component.html',
  styleUrl: './adlogin.component.css'
})
export default class AdloginComponent {
  fb = inject(FormBuilder);
  adminService = inject(AdminService);
  router = inject(Router);

  loginForm!: FormGroup;

  ngOnInit(): void {
    // Check if user_id is present in localStorage
    const adminId = localStorage.getItem('admin_id');
    if (adminId) {
      // If user_id exists, navigate to the home page
      this.router.navigate(['home']);
    }

    // Initialize the form
    this.loginForm = this.fb.group({
      staffId: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    this.adminService.adloginService(this.loginForm.value).subscribe({
      next: res => {
        localStorage.setItem('admin_id', res.data._id);
        this.adminService.isLoggedIn$.next(true);
        this.loginForm.reset();
        this.router.navigate(['home']);
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
