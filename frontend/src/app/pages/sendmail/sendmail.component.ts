import { Component } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-sendmail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './sendmail.component.html',
  styleUrl: './sendmail.component.css'
})
export default class SendmailComponent {
  email: string = '';
  message: string = '';
  success: boolean = false;

  constructor(private adminService: AdminService) {}

  sendEmail() {
    this.adminService.sendEmailService(this.email).subscribe(
      (response) => {
        this.success = true;
        this.message = response.message || 'Email sent successfully!';
      },
      (error) => {
        this.success = false;
        this.message = error.error.message || 'Failed to send email.';
      }
    );
  }
}
