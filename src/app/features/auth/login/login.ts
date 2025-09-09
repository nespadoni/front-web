import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;

  private readonly ERROR_MESSAGES = {
    email: 'Email é obrigatório',
    password: 'Senha é obrigatória'
  } as const;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router
  ) {
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.handleValidSubmission();
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  signInWithGoogle(): void {
    if (this.isLoading) return;
    console.log('Google Sign In');
    // Redireciona para home após login social
    this.redirectToHome();
  }

  signInWithApple(): void {
    if (this.isLoading) return;
    console.log('Apple Sign In');
    // Redireciona para home após login social
    this.redirectToHome();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);

    if (!field?.errors || !field.touched) {
      return '';
    }

    const errors = field.errors;

    if (errors['required']) {
      return this.ERROR_MESSAGES[fieldName as 'email' | 'password'] || 'Campo obrigatório';
    }

    if (errors['email']) {
      return 'Email inválido';
    }

    if (errors['minlength']) {
      return `Deve ter pelo menos ${errors['minlength'].requiredLength} caracteres`;
    }

    return '';
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  }

  private handleValidSubmission(): void {
    this.isLoading = true;
    const formData = this.loginForm.value;

    console.log('Login:', formData);

    // Simula API call e redireciona para home
    setTimeout(() => {
      this.isLoading = false;
      console.log('Login realizado com sucesso! Redirecionando para home...');
      this.redirectToHome();
    }, 2000);
  }

  private redirectToHome(): void {
    this.router.navigate(['/home']).then(() => {
      console.log('Redirecionado para home com sucesso!');
    });
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }
}
