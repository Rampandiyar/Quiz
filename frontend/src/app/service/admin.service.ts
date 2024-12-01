import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { apiUrls } from '../app.urls';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  http = inject(HttpClient);
  isLoggedIn$ = new BehaviorSubject<boolean>(false);

  // Admin Registration
  adRegisService(regisObj: any): Observable<any> {
    return this.http.post<any>(`${apiUrls.AdminServiceApi}ad-register`, regisObj);
  }

  // Admin Login
  adloginService(loginObj: any): Observable<any> {
    console.log(loginObj);
    return this.http.post<any>(`${apiUrls.AdminServiceApi}ad-login`, loginObj);
  }

  // Send Email Service
  sendEmailService(email: string): Observable<any> {
    return this.http.post<any>(`${apiUrls.AdminServiceApi}ad-send-email`, { email });
  }

  // Reset Password
  resetPasswordService(resetObj: any): Observable<any> {
    return this.http.post<any>(`${apiUrls.AdminServiceApi}ad-reset-password`, resetObj);
  }

  // Admin Logout
  logoutService(): Observable<any> {
    return this.http.post<any>(`${apiUrls.AdminServiceApi}ad-logout`, {});
  }

  // Enable Quiz
  quizEnableService(enableObj: any): Observable<any> {
    console.log(enableObj);
    return this.http.post<any>(`${apiUrls.AdminServiceApi}enable-test`, enableObj);
  }

  // Check if Admin is Logged In
  isLoggedIn(): boolean {
    return !!localStorage.getItem('admin_id');
  }

  // Get Admin by ID
  getAdminService(adminId: string): Observable<any> {
    return this.http.get<any>(`${apiUrls.AdminServiceApi}ad-get/${adminId}`);
  }

  // Add Quiz (Upload)
  addQuizService(formData: FormData): Observable<any> {
    return this.http.post<any>(`${apiUrls.QuizServiceApi}addquiz`, formData);
  }

  // Get Quizzes (with optional adminId filtering)
  getQuizzes(adminId?: string): Observable<any> {
    const url = adminId
      ? `${apiUrls.QuizServiceApi}quizes?adminId=${adminId}` // Include adminId to filter quizzes
      : `${apiUrls.QuizServiceApi}quizes`;
    return this.http.get<any>(url);
  }

  // Update Quiz by ID
  updateQuiz(id: string, name: string): Observable<any> {
    return this.http.put<any>(`${apiUrls.QuizServiceApi}quizes/${id}`, { name });
  }

  // Set Quiz Duration
  setQuizDurationService(quizId: string, duration: number): Observable<any> {
    return this.http.post(`${apiUrls.QuizServiceApi}/quizes/${quizId}/set-duration`, { duration });
  }

  // Delete Quiz by ID
  deleteQuiz(id: string): Observable<any> {
    return this.http.delete<any>(`${apiUrls.QuizServiceApi}quizes/${id}`);
  }

  // Get Quiz Questions
  getQuizQuestions(quizId: string): Observable<any> {
    return this.http.get<any>(`${apiUrls.QuizServiceApi}quizes/${quizId}/questions`);
  }


  // Add Users via File Upload
  addUserServicefile(formData: FormData): Observable<any> {
    return this.http.post<any>(`${apiUrls.UserServiceApi}adduser`, formData);
  }

  // Get All Users
  getUsersfile(): Observable<any> {
    return this.http.get<any>(`${apiUrls.UserServiceApi}users`);
  }

  // User Login
  userLoginService(loginObj: any): Observable<any> {
    return this.http.post<any>(`${apiUrls.UserServiceApi}ur-login`, loginObj);
  }

  // Get User by ID
  getUserService(userId: string): Observable<any> {
    return this.http.get<any>(`${apiUrls.UserServiceApi}ur-get/${userId}`);
  }

  submitQuizResults(quizId: string, quizData: any) {
    return this.http.post(`${apiUrls.QuizServiceApi}quizes/${quizId}/submit`, quizData);
}

getMarksDetails(): Observable<any> {
  return this.http.get(`${apiUrls.QuizServiceApi}quizes/all`);
}

updateUserfile(id: string, userData: { name: string }) {
  return this.http.put(`http://localhost:5000/quiz/user/users/${id}`, userData);
}

// Delete User by ID
deleteUserfile(id: string): Observable<any> {
  return this.http.delete<any>(`${apiUrls.UserServiceApi}users/${id}`);
}

addQuestion(quizId: string, questionData: any): Observable<any> {
  return this.http.post<any>(`${apiUrls.QuizServiceApi}quizzes/${quizId}/questions`, questionData);
}
// Admin Service Method to Edit Question
editQuestion(quizId: string, questionId: string, questionData: any): Observable<any> {
  return this.http.put<any>(`${apiUrls.QuizServiceApi}quizzes/${quizId}/questions/${questionId}`, questionData);
}

// Admin Service Method to Delete Question
deleteQuestion(quizId: string, questionId: string): Observable<any> {
  return this.http.delete<any>(`${apiUrls.QuizServiceApi}quizzes/${quizId}/questions/${questionId}`);
}// admin.service.ts

  getUserdetails(): Observable<any> {
    return this.http.get<any>(`${apiUrls.UserServiceApi}usersdetails`);
  }
  // Add a new user detail to the user's 'details' array// Add a new user detail to the user's 'details' array
addUserDetail(userId: string, userDetail: any): Observable<any> {
  return this.http.post<any>(`${apiUrls.UserServiceApi}/add`, {
    userId,
    ...userDetail,
  });
}

// Edit an existing user detail in the 'details' array
editUserDetail(userId: string, userDetailId: string, updatedDetails: any): Observable<any> {
  return this.http.put<any>(`${apiUrls.UserServiceApi}/edit`, {
    userId,
    userDetailId,
    updatedDetails,
  });
}

// Delete a user detail from the 'details' array
deleteUserDetail(userId: string, userDetailId: string): Observable<any> {
  return this.http.delete<any>(`${apiUrls.UserServiceApi}/delete`, {
    body: { userId, userDetailId },
  });
}


}
