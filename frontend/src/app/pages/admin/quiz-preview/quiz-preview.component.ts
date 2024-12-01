import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone:true,
  imports: [RouterModule,FormsModule,CommonModule],
  selector: 'app-quiz-preview',
  templateUrl: './quiz-preview.component.html',
  styleUrls: ['./quiz-preview.component.css'],
})
export default class QuizPreviewComponent implements OnInit {
  quiz: any = null; // Initialize quiz to null
  currentQuestion: any = { qno: '', question: '', option1: '', option2: '', option3: '', option4: '', correctAnswer: '' };
  isQuizLoaded: boolean = false; // To track if quiz is fully loaded
  router = inject(Router);
  isModalOpen: boolean = false;

  constructor(private route: ActivatedRoute, private quizService: AdminService) {}

  ngOnInit() {
    const quizId = this.route.snapshot.paramMap.get('id'); // Get the quiz ID from the route parameters
    if (quizId) {
      this.loadQuiz(quizId); // Load the quiz based on the ID
    } else {
      console.error('Quiz ID is missing from the URL.');
    }
  }

  loadQuiz(quizId: string) {
    this.quizService.getQuizQuestions(quizId).subscribe({
      next: (response) => {
        if (response && response._id && response.questions) {
          this.quiz = response;
          this.isQuizLoaded = true;
        } else {
          console.error('No valid quiz data received.');
        }
      },
      error: (err) => console.error('Error fetching quiz questions:', err),
    });
  }
  openModal() {
    this.isModalOpen = true; // Open the modal
  }

  closeModal() {
    this.isModalOpen = false; // Close the modal
    this.resetForm(); // Reset the form when closing the modal
  }

  submitQuestion() {
    if (this.currentQuestion._id) {
      // Edit existing question
      this.quizService.editQuestion(this.quiz._id, this.currentQuestion._id, this.currentQuestion).subscribe({
        next: (response) => {
          this.loadQuiz(this.quiz._id); // Reload quiz questions
          this.resetForm(); // Reset form
        },
        error: (err) => console.error('Error editing question:', err),
      });
    } else {
      // Add new question
      this.quizService.addQuestion(this.quiz._id, this.currentQuestion).subscribe({
        next: (response) => {
          this.loadQuiz(this.quiz._id); // Reload quiz questions
          this.resetForm(); // Reset form
        },
        error: (err) => console.error('Error adding question:', err),
      });
    }
  }

  editQuestion(question: any) {
    this.currentQuestion = { ...question }; // Set the current question to edit
  }

  deleteQuestion(questionId: string) {
    this.quizService.deleteQuestion(this.quiz._id, questionId).subscribe({
      next: (response) => {
        this.loadQuiz(this.quiz._id); // Reload quiz questions
      },
      error: (err) => console.error('Error deleting question:', err),
    });
  }

  resetForm() {
    this.currentQuestion = { qno: '', question: '', option1: '', option2: '', option3: '', option4: '', correctAnswer: '' }; // Reset form fields
  }

  quit() {
    this.router.navigate(['/home']);
  }
}
