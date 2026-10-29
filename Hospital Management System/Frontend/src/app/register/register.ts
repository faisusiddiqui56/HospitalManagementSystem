import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  
  errorMessage = signal('');

  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
  });

  onSubmit() {
    this.errorMessage.set('');
    if (this.registerForm.valid) {
      const success = this.authService.register(this.registerForm.value);
      if (success) {
        this.router.navigate(['/login']);
      } else {
        this.errorMessage.set('Email already exists. Please use a different one or login.');
      }
    }
  }
}
