
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,ReactiveFormsModule,Validators } from '@angular/forms'
import { AdminService } from '../../../service/admin.service';
import { Router, RouterModule } from '@angular/router';
import { confirmPasswordValidator } from '../../../validators/confirm-password.validators';

@Component({
  selector: 'app-adregis',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './adregis.component.html',
  styleUrl: './adregis.component.css'
})
export default class AdregisComponent implements OnInit {

  fb=inject(FormBuilder);

  adminService=inject(AdminService);
  router=inject(Router);
  adminregisForm!: FormGroup;
  ngOnInit():void {
    this.adminregisForm=this.fb.group({
      name: ['', Validators.required],
      staffId: ['', Validators.required],
      email: ['',Validators.compose([Validators.required, Validators.email])],
      isAdmin:true,
      password: ['',Validators.required],
      confirmpassword: ['',Validators.required]
    },
    {
      validators: confirmPasswordValidator('password', 'confirmpassword')
    }

  );
  }
  register(){
    this.adminService.adRegisService(
      this.adminregisForm.value
    )
    .subscribe({
      next: (res)=>{
        alert("Admin Created");
        this.adminregisForm.reset();
        this.router.navigate(['']);
      },
      error: (err)=>{
        console.log(err);
        alert("Admin not Created");
      }
    })
    //Submit form to server here.
  }
}
