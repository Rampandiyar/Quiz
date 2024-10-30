import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../service/admin.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.css'],
})
export class AddQuizComponent implements OnInit {
  selectedFile: File | null = null;
  quizzes: any[] = [];
  showTimerPopup = false;
  quizDuration: number | null = null;
  selectedQuizId: string | null = null;

  // Alert properties
  showAlert = false;
  showDeleteConfirmation = false;
  alertMessage = '';
  alertType = '';
  selectedQuizIdForDelete: string | null = null;
  showEditModal = false;
  editQuizName: string = '';

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.getQuizzes(); // Load quizzes on initialization
  }

  // Show custom alert with message
  showAlertMessage(message: string, type: string): void {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
  }

  // Close custom alert
  closeAlert(): void {
    this.showAlert = false;
    this.alertMessage = '';
    this.alertType = '';
  }

  // Open delete confirmation dialog
  openDeleteConfirmation(quizId: string): void {
    this.selectedQuizId = quizId;
    this.showDeleteConfirmation = true;
  }

  // Close delete confirmation dialog
  closeDeleteConfirmation(): void {
    this.showDeleteConfirmation = false;
    this.selectedQuizId = null;
  }

  // Open edit modal
  editQuiz(id: string, name: string): void {
    this.selectedQuizId = id;
    this.editQuizName = name;
    this.showEditModal = true;
  }

  // Close the edit modal
  closeEditModal(): void {
    this.showEditModal = false;
    this.editQuizName = '';
  }

  // Confirm delete action
  confirmDelete(id: string): void {
    this.adminService.deleteQuiz(id).subscribe({
      next: () => {
        this.handleDeleteSuccess(); // Handle successful deletion
      },
      error: (err) => {
        console.error('Error deleting quiz:', err);
        this.showAlertMessage('Error deleting quiz: ' + err.message, 'error');
        this.closeDeleteConfirmation();
      },
    });
  }

  // Handle successful deletion
  private handleDeleteSuccess(): void {
    this.getQuizzes(); // Refresh the quiz list
    this.showAlertMessage('Quiz deleted successfully!', 'success');
    this.closeDeleteConfirmation();
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('excel', this.selectedFile);

    this.adminService.addQuizService(formData).subscribe(
      (response) => {
        this.showAlertMessage('Quiz added successfully!', 'success');
        this.getQuizzes(); // Refresh the quizzes list after adding
      },
      (error) => {
        console.error('Error adding quiz:', error);
        this.showAlertMessage('Error adding quiz: ' + error.message, 'error');
      }
    );
  }

  getQuizzes(): void {
    this.adminService.getQuizzes('').subscribe(
      (response) => {
        this.quizzes = response.quizzes;
      },
      (error) => {
        console.error('Error fetching quizzes:', error);
        this.showAlertMessage('Error fetching quizzes: ' + error.message, 'error');
      }
    );
  }

  openTimerPopup(quizId: string): void {
    this.selectedQuizId = quizId;
    this.showTimerPopup = true;
  }

  closeTimerPopup(): void {
    this.showTimerPopup = false;
    this.quizDuration = null;
  }

  setQuizDuration(): void {
    if (this.quizDuration && this.selectedQuizId) {
      const durationInSeconds = this.quizDuration * 60;

      this.adminService.setQuizDurationService(this.selectedQuizId, durationInSeconds).subscribe({
        next: () => this.enableQuiz(),
        error: (err) => this.showAlertMessage('Error setting quiz duration: ' + err.message, 'error'),
      });
    } else {
      this.showAlertMessage('Please enter a valid duration.', 'error');
    }
  }

  private enableQuiz(): void {
    this.adminService.quizEnableService({ quizId: this.selectedQuizId }).subscribe({
      next: () => {
        this.showAlertMessage('Quiz duration set and quiz enabled successfully!', 'success');
        this.closeTimerPopup();
        this.getQuizzes(); // Refresh the quizzes list after enabling
      },
      error: (err) => this.showAlertMessage('Error enabling quiz: ' + err.message, 'error'),
    });
  }

  confirmEditQuiz(): void {
    if (this.selectedQuizId && this.editQuizName) {
      this.adminService.updateQuiz(this.selectedQuizId, this.editQuizName).subscribe({
        next: () => {
          this.getQuizzes(); // Refresh the quizzes list after editing
          this.showAlertMessage(`Updated "${this.editQuizName}" successfully!`, 'success');
          this.closeEditModal();
        },
        error: (err) => {
          console.error('Error updating quiz:', err);
          this.showAlertMessage('Error updating quiz: ' + err.message, 'error');
        },
      });
    } else {
      this.showAlertMessage('Please enter a valid quiz name.', 'error');
    }
  }

  deleteQuiz(id: string): void {
    this.openDeleteConfirmation(id);
  }

  preview(quizId: string): void {
    if (quizId) {
      this.router.navigate(['/preview', quizId]);
    } else {
      this.showAlertMessage('Quiz ID is missing.', 'error');
    }
  }

  marks(){
    this.router.navigate(['/marks']);
  }
}
