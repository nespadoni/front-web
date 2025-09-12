import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router'; // Adicionar RouterLink
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink // Adicionar RouterLink aos imports
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  private readonly ERROR_MESSAGES = {
    email: 'Email é obrigatório',
    password: 'Senha é obrigatória'
  } as const;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  onSubmit(): void {
    this.errorMessage = null; // Resetar mensagem de erro
    if (this.loginForm.valid) {
      this.handleValidSubmission();
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  signInWithGoogle(): void {
    if (this.isLoading) return;
    console.log('Google Sign In');
    this.redirectToHome();
  }

  signInWithApple(): void {
    if (this.isLoading) return;
    console.log('Apple Sign In');
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
    const {email, password} = this.loginForm.value;

    this.authService.login({email, password}).subscribe({
      next: () => {
        // Se chegou aqui, a resposta foi validada e o token foi salvo pelo AuthService.
        console.log('Login realizado com sucesso! Redirecionando para home...');

        // Desativa o spinner ANTES de navegar para que a UI não fique travada.
        this.isLoading = false;
        this.redirectToHome();
      },
      error: (err) => {
        console.error('Erro no login:', err);
        // A mensagem de erro pode vir da API ou do erro que lançamos no 'tap'
        this.errorMessage = err.error?.message || err.message || 'Email ou senha inválidos.';
        this.isLoading = false; // Garante que o spinner pare em caso de erro.
      }
    });
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
