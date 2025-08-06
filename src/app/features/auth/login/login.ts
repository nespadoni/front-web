import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const {email, password, remember} = this.loginForm.value;

      // Aqui você chamaria seu serviço de autenticação
      console.log('Login:', {email, password, remember});

      // Simular delay da API
      setTimeout(() => {
        this.isLoading = false;
        // this.router.navigate(['/dashboard']);
      }, 2000);
    } else {
      // Marcar todos os campos como touched para mostrar erros
      this.markAllFieldsAsTouched();
    }
  }

  signInWithGoogle(): void {
    console.log('Google Sign In');
  }

  signInWithApple(): void {
    console.log('Apple Sign In');
  }

  // ✅ MÉTODOS AUXILIARES PARA OS TOOLTIPS (igual ao register)
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);

    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return this.getRequiredMessage(fieldName);
      }
      if (field.errors['email']) {
        return 'Email inválido';
      }
      if (field.errors['minlength']) {
        const minLength = field.errors['minlength'].requiredLength;
        return `Deve ter pelo menos ${minLength} caracteres`;
      }
    }

    return '';
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  private getRequiredMessage(fieldName: string): string {
    const messages: { [key: string]: string } = {
      email: 'Email é obrigatório',
      password: 'Senha é obrigatória'
    };

    return messages[fieldName] || 'Campo obrigatório';
  }
}
