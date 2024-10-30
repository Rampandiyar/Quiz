import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-preview.component.html',
  styleUrls: ['./quiz-preview.component.css']
})
export default class QuizPreviewComponent implements OnInit, OnDestroy {
  quiz: any = null; // Initialize quiz to null
  isQuizLoaded: boolean = false; // To track if quiz is fully loaded
  router = inject(Router);

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

          // Set up options for each question
          this.quiz.questions.forEach((question: any) => {
            question.options = [
              question.option1,
              question.option2,
              question.option3,
              question.option4,
            ];
          });

          this.isQuizLoaded = true;
        } else {
          console.error('No valid quiz data received.');
        }
      },
      error: (err) => console.error('Error fetching quiz questions:', err),
    });
  }

  submitQuiz() {

  }

  collectAnswers() {
    const answers: string[] = []; // Initialize an array for answers

    this.quiz.questions.forEach((question: any) => {
      if (question.selectedAnswer) { // Assuming 'selectedAnswer' holds the answer chosen by the user
        answers.push(question.selectedAnswer); // Add the selected answer to the array
      }
    });

    return answers; // Return the collected answers as an array of strings
  }

  ngOnDestroy() {
    // No need for timer-related cleanup
  }

  quit() {
    this.router.navigate(['/home']);
  }
}
