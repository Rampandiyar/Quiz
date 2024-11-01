import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


export const routes: Routes = [
  {path:'adregis',loadComponent:()=> import('./pages/admin/adregis/adregis.component')},
  {path:'preview/:id',loadComponent:()=> import('./pages/admin/quiz-preview/quiz-preview.component')},
  {path:'',loadComponent:()=> import('./pages/admin/adlogin/adlogin.component')},
  {path:'home',loadComponent:()=> import('./pages/admin/addash/addash.component')},
  {path:'sendmail',loadComponent:()=> import('./pages/sendmail/sendmail.component')},
  {path:'adforgetpass',loadComponent:()=> import('./pages/forgetpassword/forgetpassword.component')},
  {path:'quiz-preview/:id', loadComponent:()=>import('./pages/admin/quiz-preview/quiz-preview.component') },
  {path:'userdash',loadComponent:()=>import('./pages/user/userdash/userdash.component')},
  {path:'uslogin',loadComponent:()=>import('./pages/user/user-login/user-login.component')},
  {path:'quiz/:id',loadComponent:()=>import('./components/user/quiztest/quiztest.component')},
  {path:'users',loadComponent:()=>import('./pages/user/userpage/userpage.component')},
  {path:'marks',loadComponent:()=>import('./pages/admin/marks/marks.component')}
];
