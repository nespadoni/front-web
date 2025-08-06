import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      university: ['', [Validators.required]],
      role: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordStrengthValidator
      ]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Validador customizado para verificar se as senhas coincidem
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return {passwordMismatch: true};
    }

    return null;
  }

  // Validador customizado para força da senha
  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;

    if (!password) {
      return null;
    }

    const hasNumber = /[0-9]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasSpecial = /[#?!@$%^&*-]/.test(password);

    const valid = hasNumber && hasUpper && hasLower && hasSpecial;

    if (!valid) {
      return {weakPassword: true};
    }

    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;

      const formData = {
        firstName: this.registerForm.get('firstName')?.value,
        lastName: this.registerForm.get('lastName')?.value,
        university: this.registerForm.get('university')?.value,
        role: this.registerForm.get('role')?.value,
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value
      };

      // Aqui você chamaria seu serviço de registro
      console.log('Register:', formData);

      // Simular chamada da API
      setTimeout(() => {
        this.isLoading = false;
        // Redirecionar para login após registro bem-sucedido
        this.router.navigate(['/login'], {
          queryParams: {message: 'Account created successfully! Please sign in.'}
        });
      }, 2000);
    } else {
      // Marcar todos os campos como touched para mostrar erros
      this.markAllFieldsAsTouched();
    }
  }

  signUpWithGoogle(): void {
    console.log('Google Sign Up');
    // Implementar integração com Google OAuth
  }

  signUpWithApple(): void {
    console.log('Apple Sign Up');
    // Implementar integração com Apple Sign In
  }

  // Métodos auxiliares para o template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);

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
      if (field.errors['weakPassword']) {
        return 'Senha deve conter: maiúscula, minúscula, número e símbolo';
      }
    }

    // Verificar erro de senhas diferentes
    if (fieldName === 'confirmPassword' && this.registerForm.errors?.['passwordMismatch']) {
      return 'Senhas não coincidem';
    }

    return '';
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  private getRequiredMessage(fieldName: string): string {
    const messages: { [key: string]: string } = {
      firstName: 'Nome é obrigatório',
      lastName: 'Sobrenome é obrigatório',
      university: 'Universidade é obrigatória',
      role: 'Função é obrigatória',
      email: 'Email é obrigatório',
      password: 'Senha é obrigatória',
      confirmPassword: 'Confirmação de senha é obrigatória',
      acceptTerms: 'Você deve aceitar os termos'
    };

    return messages[fieldName] || 'Campo obrigatório';
  }
}
