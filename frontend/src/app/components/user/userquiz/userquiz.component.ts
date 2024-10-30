// userquiz.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../service/admin.service';

@Component({
  selector: 'app-userquiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './userquiz.component.html',
  styleUrls: ['./userquiz.component.css']  // Corrected 'styleUrl' to 'styleUrls'
})
export class UserquizComponent implements OnInit {
  quizzes: any[] = [];
  isQuizDisabled: boolean = false;  // Track if quiz start is disabled

  constructor(private userService: AdminService, private router: Router) {}

  ngOnInit() {
    this.loadAvailableQuizzes();
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
    if (!this.isQuizDisabled) {
      const quizPageUrl = `/quiz/${quizId}`;
      this.router.navigate([quizPageUrl]);

      // Request fullscreen
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if ((document as any).webkitRequestFullscreen) {  // For Safari
        (document.documentElement as any).webkitRequestFullscreen();
      } else if ((document as any).msRequestFullscreen) {  // For IE11
        (document.documentElement as any).msRequestFullscreen();
      }
    }
  }
}

