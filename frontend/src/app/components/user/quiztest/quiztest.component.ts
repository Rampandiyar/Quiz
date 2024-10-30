import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { CommonModule } from '@angular/common';

interface Question {
  correctAnswer: string;
}

interface Quiz {
  _id: string;
  questions: Question[];
}

@Component({
  selector: 'app-quiztest',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quiztest.component.html',
  styleUrls: ['./quiztest.component.css']
})
export default class QuiztestComponent implements OnInit, OnDestroy {
  quiz: any = null;
  timer: { hours: number; minutes: number; seconds: number } = { hours: 0, minutes: 0, seconds: 0 };
  interval: any;
  isQuizLoaded: boolean = false;
  lastTimeChecked: number = 0;
  router = inject(Router);

  currentQuestionIndex: number = 0;
  answeredQuestions: boolean[] = [];
  selectedAnswers: string[] = [];
  isPageQuit: boolean = false;

  userDetails = {
    name: '',
    regno: '',
    rollno: '',
    department: '',
    year: ''
  };

  constructor(private route: ActivatedRoute, private quizService: AdminService) {}

  ngOnInit() {
    const quizId = this.route.snapshot.paramMap.get('id');
    if (quizId) {
      this.loadQuiz(quizId);
    } else {
      console.error('Quiz ID is missing from the URL.');
    }

    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    window.addEventListener('beforeunload', this.preventReload.bind(this));

    // Fullscreen change event listener
    document.addEventListener('fullscreenchange', this.handleFullscreenChange.bind(this));
  }

  loadQuiz(quizId: string) {
    this.quizService.getQuizQuestions(quizId).subscribe({
      next: (response) => {
        if (response && response._id && response.questions) {
          this.quiz = response;
          this.quiz.questions.forEach((question: any) => {
            question.options = [
              question.option1,
              question.option2,
              question.option3,
              question.option4,
            ];
          });

          this.isQuizLoaded = true;
          this.timer.hours = Math.floor(this.quiz.duration / 3600);
          this.timer.minutes = Math.floor((this.quiz.duration % 3600) / 60);
          this.timer.seconds = this.quiz.duration % 60;

          this.loadSelectedAnswers();
          this.startTimer();
        } else {
          console.error('No valid quiz data received.');
        }
      },
      error: (err) => console.error('Error fetching quiz questions:', err),
    });
  }

  handleFullscreenChange() {
    if (!document.fullscreenElement && this.isQuizLoaded) {
      this.quit();
    }
  }

  loadSelectedAnswers() {
    const savedAnswers = localStorage.getItem('quiz-answers');
    if (savedAnswers) {
      this.selectedAnswers = JSON.parse(savedAnswers);
      this.answeredQuestions = this.selectedAnswers.map(answer => answer !== null);
    } else {
      this.selectedAnswers = new Array(this.quiz.questions.length).fill(null);
      this.answeredQuestions = new Array(this.quiz.questions.length).fill(false);
    }
  }

  saveSelectedAnswer() {
    localStorage.setItem('quiz-answers', JSON.stringify(this.selectedAnswers));
  }

  startTimer() {
    clearInterval(this.interval);
    const savedTimer = localStorage.getItem('quiz-timer');
    if (savedTimer) {
      const parsedTimer = JSON.parse(savedTimer);
      this.timer = parsedTimer;
    } else {
      this.timer.hours = Math.floor(this.quiz.duration / 3600);
      this.timer.minutes = Math.floor((this.quiz.duration % 3600) / 60);
      this.timer.seconds = this.quiz.duration % 60;
    }

    this.interval = setInterval(() => {
      if (this.timer.hours === 0 && this.timer.minutes === 0 && this.timer.seconds === 0) {
        clearInterval(this.interval);
        this.submitQuiz();
      } else {
        this.decrementTimer();
        this.saveTimerState();
      }
    }, 1000);
  }

  decrementTimer() {
    if (this.timer.seconds > 0) {
      this.timer.seconds--;
    } else {
      if (this.timer.minutes > 0) {
        this.timer.minutes--;
        this.timer.seconds = 59;
      } else if (this.timer.hours > 0) {
        this.timer.hours--;
        this.timer.minutes = 59;
        this.timer.seconds = 59;
      }
    }
  }

  saveTimerState() {
    localStorage.setItem('quiz-timer', JSON.stringify(this.timer));
  }

  handleVisibilityChange() {
    if (document.hidden || this.isPageQuit) {
      clearInterval(this.interval);
      this.lastTimeChecked = Date.now();
      this.saveTimerState();
    } else {
      const timeAway = Math.floor((Date.now() - this.lastTimeChecked) / 1000);
      this.adjustTimerForTimeAway(timeAway);
      this.startTimer();
    }
  }

  adjustTimerForTimeAway(secondsAway: number) {
    let totalSeconds = this.timer.hours * 3600 + this.timer.minutes * 60 + this.timer.seconds - secondsAway;
    if (totalSeconds <= 0) {
      totalSeconds = 0;
    }
    this.timer.hours = Math.floor(totalSeconds / 3600);
    this.timer.minutes = Math.floor((totalSeconds % 3600) / 60);
    this.timer.seconds = totalSeconds % 60;
  }

  preventReload(event: BeforeUnloadEvent) {
    if (this.isQuizLoaded) {
      event.preventDefault();
      event.returnValue = '';
    }
  }

  goToNextQuestion() {
    if (this.currentQuestionIndex < this.quiz.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  goToPreviousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  goToQuestion(index: number) {
    this.currentQuestionIndex = index;
  }

  markQuestionAsAnswered() {
    this.answeredQuestions[this.currentQuestionIndex] = true;
  }

  onOptionChange(option: string) {
    this.selectedAnswers[this.currentQuestionIndex] = option.trim();
    this.saveSelectedAnswer();
    this.markQuestionAsAnswered();
  }

  submitQuiz() {
    const answers = this.collectAnswers();
    const marks = this.calculateMarks();

    const userDetails = JSON.parse(localStorage.getItem('user_details') || '{}');
    userDetails.mark = marks;

    const quizData = {
      quizId: this.quiz._id,
      name: userDetails.name || '',
      regno: userDetails.regno || '',
      rollno: userDetails.rollno || '',
      department: userDetails.department || '',
      year: userDetails.year || '',
      mark: marks
    };

    this.quizService.submitQuizResults(quizData.quizId, quizData).subscribe({
      next: (response) => {
        this.router.navigate(['/userdash']);
      },
      error: (err) => {
        console.error("Error submitting quiz:", err);
      }
    });
  }

  collectAnswers() {
    return this.selectedAnswers.map((answer, index) => ({
      questionId: this.quiz.questions[index]._id,
      answer
    }));
  }

  calculateMarks() {
    let marks = 0;
    this.selectedAnswers.forEach((answer, index) => {
      if (answer === this.quiz.questions[index].correctAnswer) {
        marks++;
      }
    });
    return marks;
  }

  quit() {
    clearInterval(this.interval);
    this.router.navigate(['/userdash']);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    window.removeEventListener('beforeunload', this.preventReload.bind(this));
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange.bind(this));
  }
}
