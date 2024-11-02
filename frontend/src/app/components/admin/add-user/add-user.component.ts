import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  _id: string;
  name: string;
  department: string;
  year: string;
}

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {
  selectedFile: File | null = null;
  users: User[] = [];
  showAlert = false;
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';
  showDeleteConfirmation = false;
  selectedUserId: string | null = null;
  showEditModal = false;
  editUserName: string = '';
  currentUserId: string = '';

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
    const formData = new FormData();
    if (!this.selectedFile) {
      this.showAlertMessage('Please select a file.', 'error');
      return;
    }

    formData.append('excel', this.selectedFile);

    this.adminService.addUserServicefile(formData).subscribe({
      next: () => {
        this.showAlertMessage('File uploaded successfully', 'success');
        location.reload(); // Reload the page
      },
      error: (err) => this.showAlertMessage('Error uploading file: ' + err.message, 'error'),
    });
  }

  loadUsers(): void {
    this.adminService.getUsersfile().subscribe({
      next: (response) => {
        this.users = response.users.map((user: any) => ({
          ...user,
          department: 'Computer Science and Business Systems',
          year: '3',
        }));
      },
      error: (err) => console.error('Error loading users:', err),
    });
  }

  editUser(id: string, name: string): void {
    this.currentUserId = id;
    this.editUserName = name;
    this.showEditModal = true;
  }

  confirmEditUser(): void {
    if (this.editUserName.trim()) {
      this.adminService.updateUserfile(this.currentUserId, { name: this.editUserName }).subscribe({
        next: () => {
          this.showAlertMessage('User updated successfully', 'success');
          location.reload(); // Reload the page
        },
        error: (err) => this.showAlertMessage('Error updating user: ' + err.message, 'error'),
      });
    }
  }

  openDeleteConfirmation(id: string): void {
    this.selectedUserId = id;
    this.showDeleteConfirmation = true;
  }

  confirmDelete(id: string): void {
    this.adminService.deleteUserfile(id).subscribe({
      next: () => {
        this.showAlertMessage('User deleted successfully', 'success');
        location.reload(); // Reload the page
      },
      error: (err) => this.showAlertMessage('Error deleting user: ' + err.message, 'error'),
    });
  }

  closeDeleteConfirmation(): void {
    this.showDeleteConfirmation = false;
  }

  closeAlert(): void {
    this.showAlert = false;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  showAlertMessage(message: string, type: 'success' | 'error') {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;

    // Auto-hide the alert after 3 seconds
    setTimeout(() => {
      this.closeAlert();
    }, 3000);
  }

  page() {
    this.router.navigate(['users']);
  }
}
