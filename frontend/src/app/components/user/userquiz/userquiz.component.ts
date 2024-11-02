import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../service/admin.service';

@Component({
  selector: 'app-userquiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './userquiz.component.html',
  styleUrls: ['./userquiz.component.css']
})
export class UserquizComponent implements OnInit {
  quizzes: any[] = [];
  isQuizDisabled: boolean = false;  // Track if quiz start is disabled
  quizStarted: boolean = false;      // Track if a quiz has been started by the user

  constructor(private userService: AdminService, private router: Router) {}

  ngOnInit() {
    this.loadAvailableQuizzes();

    // Check if the user has already started a quiz
    this.quizStarted = localStorage.getItem('quizStarted') === 'true' || false; // Default to false
    this.isQuizDisabled = localStorage.getItem('quizEnded') === 'true' || false; // Default to false
  }

  loadAvailableQuizzes() {
    this.userService.getQuizzes().subscribe({
      next: (response) => {
        if (response.quizzes && response.quizzes.length > 0) {
          this.quizzes = response.quizzes;
        } else {
          console.log('No quizzes available.');
        }
      },
      error: (err) => console.error('Error loading quizzes:', err),
    });
  }

  startQuiz(quizId: string) {
    if (!this.isQuizDisabled && !this.quizStarted) {  // Only start if quiz is not disabled and not already started
      const quizPageUrl = `/quiz/${quizId}`;
      this.router.navigate([quizPageUrl]);

      // Mark that the user has started the quiz
      localStorage.setItem('quizStarted', 'true');

      // Request fullscreen
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if ((document as any).webkitRequestFullscreen) {  // For Safari
        (document.documentElement as any).webkitRequestFullscreen();
      } else if ((document as any).msRequestFullscreen) {  // For IE11
        (document.documentElement as any).msRequestFullscreen();
      }
    } else {
      alert('You can only start the quiz once.');
    }
  }
}
