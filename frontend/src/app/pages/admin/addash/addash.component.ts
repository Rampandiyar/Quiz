import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../service/admin.service';
import { HeaderComponent } from '../../../components/admin/header/header.component';
import { CommonModule } from '@angular/common';
import { AddQuizComponent } from '../../../components/admin/add-quiz/add-quiz.component';
import { AddUserComponent } from '../../../components/admin/add-user/add-user.component';

@Component({
  selector: 'app-addash',
  standalone: true,
  imports: [HeaderComponent, CommonModule, AddQuizComponent, AddUserComponent],
  templateUrl: './addash.component.html',
  styleUrls: ['./addash.component.css']
})
export default class AddashComponent implements OnInit {
  totalQuizzes: number = 0;
  totalUsers: number = 0;
  quizzesInProgress: number = 0;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.getTotalQuizzes();
    this.getTotalUsers();
    this.getQuizzesInProgress();
  }

  getTotalQuizzes() {
    this.adminService.getQuizzes().subscribe((response) => {
      this.totalQuizzes = response.quizzes.length; // Assuming response contains a quizzes array
      this.quizzesInProgress = response.quizzes.filter((quiz: { active: any; }) => quiz.active).length; // Count active quizzes
    });
  }

  getTotalUsers() {
    this.adminService.getUsersfile().subscribe((response) => {
      this.totalUsers = response.users.length; // Assuming response contains a users array
    });
  }

  getQuizzesInProgress() {
    // This can also be part of getTotalQuizzes as shown above
    this.adminService.getQuizzes().subscribe((response) => {
      this.quizzesInProgress = response.quizzes.filter((quiz: { active: any; }) => quiz.active).length; // Count active quizzes
    });
  }
}
