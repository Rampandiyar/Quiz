import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../service/admin.service'; // Import the AdminService

interface User {
  name: string;
  regno: number;
  rollno: string;
  department: string;
  password: string; // Added password field to the User interface
  year: number;
  email: string;
  number: string;
  mark:number;
}

@Component({
  selector: 'app-userpage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './userpage.component.html',
  styleUrls: ['./userpage.component.css']
})
export default class UserpageComponent implements OnInit {
  users: User[] = []; // Initialize an empty array to hold the users

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.adminService.getUserdetails().subscribe(
      (data: any) => {
        this.users = data.users.map((user: any) => ({
          name: user.name || 'N/A',
          regno: user.regno || 0,
          rollno: user.rollno || 'N/A',
          department: user.department || 'N/A',
          password: user.password || 'N/A',
          year: user.year || 1,
          email: user.email || 'N/A',
          number: user.number || 'N/A',
        }));
      },
      (error) => {
        console.error('Error fetching users:', error); // Ensure no console log
      }
    );
  }
}
