import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {
  selectedFile: File | null = null;
  users: any[] = [];
  showAlert = false;
  alertMessage = '';
  alertType: 'success' | 'error' = 'success'; // Type for alert
  showDeleteConfirmation = false;
  selectedUserId: string | null = null; // Store selected user ID for deletion
  showEditModal = false;
  editUserName: string = ''; // For editing user name
  currentUserId: string = ''; // For identifying which user is being edited

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
        this.loadUsers();
      },
      error: (err) => this.showAlertMessage('Error uploading file: ' + err.message, 'error'),
    });
  }

  loadUsers(): void {
    this.adminService.getUsersfile().subscribe({
      next: (response) => {
        this.users = response.users.map((user: any) => ({
          ...user,
          department: 'Computer Science and Business Systems', // Set department name
          year: '3', // Set year
        }));
      },
      error: (err) => console.error('Error loading users:', err),
    });
  }

  editUser(id: string, name: string): void {
    this.currentUserId = id;
    this.editUserName = name; // Set the current user name
    this.showEditModal = true; // Show edit modal
  }

  confirmEditUser(): void {
    if (this.editUserName.trim()) {
      this.adminService.updateUserfile(this.currentUserId, { name: this.editUserName }).subscribe({
        next: () => {
          this.showAlertMessage('User updated successfully', 'success');
          this.loadUsers(); // Reload user list
          this.closeEditModal(); // Close edit modal
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
        this.loadUsers(); // Reload user list
        this.closeDeleteConfirmation(); // Close delete confirmation
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
  }

  page(){
    this.router.navigate(['users']);
  }
}
