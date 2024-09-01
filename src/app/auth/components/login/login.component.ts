import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { StorageService } from '../../services/storage/storage.service';
import { Router } from '@angular/router'; 
import { NzMessageService } from 'ng-zorro-antd/message'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'] 
})
export class LoginComponent implements OnInit {
  isSpinning: boolean = false;
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private message: NzMessageService,
    private storageService: StorageService  // حقن خدمة StorageService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]], 
      password: [null, [Validators.required]]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.message.error("Please fill in the form correctly.", { nzDuration: 5000 });
      return;
    }

    console.log(this.loginForm.value);
    this.isSpinning = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        console.log(res);
        if (res.userId != null && res.jwt != null) {
          const user = {
            id: res.userId,
            role: res.userRole
          };
          this.storageService.saveUser(user);  // استخدام الدالة غير الساكنة
          this.storageService.saveToken(res.jwt);  // استخدام الدالة غير الساكنة
          this.isSpinning = false;
          
          if ( this.storageService.isAdminLoggedIn()) {  // استخدام الدالة غير الساكنة
            this.router.navigateByUrl("/admin/dashboard");
          } else if ( this.storageService.isCustomerLoggedIn()) {  // استخدام الدالة غير الساكنة
            this.router.navigateByUrl("/customer/dashboard");
          } else {
            this.message.error("Bad credentials", { nzDuration: 5000 });
          }
        } else {
          this.message.error("Invalid response from server.", { nzDuration: 5000 });
        }
      },
      error: (err: HttpErrorResponse) => {
        this.isSpinning = false;
        this.message.error("Login failed. Please try again.", { nzDuration: 5000 });
        console.error("Login error", err);
      }
    });
  }
}
