import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})

export class Header implements OnInit, OnDestroy {

  @Output() toggleSidebar = new EventEmitter<void>();

  currentDate: Date = new Date();

  private timer: any;

  // Login popup
  showLoginPopup: boolean = false;

  userId: string = '';
  password: string = '';

  captchaText: string = '';
captchaInput: string = '';
captchaCode: string = '';
  showPassword: boolean = false;
  loginError: string = '';
  isLoading: boolean = false;

generateCaptcha(): void {

    const characters =
      'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    let captcha = '';

    for (let i = 0; i < 6; i++) {

      const randomIndex =
        Math.floor(
          Math.random() * characters.length
        );

      captcha += characters.charAt(randomIndex);

    }

    this.captchaCode = captcha;

    this.captchaInput = '';

    console.log(
      'Generated CAPTCHA:',
      this.captchaCode
    );

  }

   togglePassword(): void {

    this.showPassword =
      !this.showPassword;

  }

  ngOnInit(): void {
    this.generateCaptcha();
    this.timer = setInterval(() => {
      this.currentDate = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  // Open login popup
  openLoginPopup(): void {

    this.showLoginPopup = true;

    this.userId = '';

    this.password = '';

    this.captchaInput = '';

    this.loginError = '';

    this.showPassword = false;

    this.isLoading = false;

    // Generate new CAPTCHA
    this.generateCaptcha();

  }

  // Close login popup
  closeLoginPopup(): void {

    this.showLoginPopup = false;

    this.userId = '';

    this.password = '';

    this.captchaInput = '';

    this.loginError = '';

    this.showPassword = false;

    this.isLoading = false;

  }


  // Login
login(): void {

  if (
      !this.userId ||
      this.userId.trim() === ''
    ) {

      this.loginError =
        'Please enter User ID.';

      return;

    }

  if (
      !this.password ||
      this.password.trim() === ''
    ) {

      this.loginError =
        'Please enter Password.';

      return;

    }

  if (
      !this.captchaInput ||
      this.captchaInput.trim() === ''
    ) {

      this.loginError =
        'Please enter Captcha.';

      return;

    }

  if (
      this.captchaInput.trim().toUpperCase() !==
      this.captchaCode.trim().toUpperCase()
    ) {

      this.loginError =
        'Invalid Captcha. Please try again.';

      // Generate new CAPTCHA
      this.generateCaptcha();

      return;

    }

  // CAPTCHA correct
  console.log('User ID:', this.userId);
  console.log('Password:', this.password);
  console.log('CAPTCHA verified');

  setTimeout(() => {

      this.isLoading = false;

      console.log(
        'User ID:',
        this.userId
      );

      console.log(
        'Password:',
        this.password
      );

      console.log(
        'CAPTCHA:',
        this.captchaInput
      );

    }, 500);

  }



  // Yahan login API call kar sakte hain
}


