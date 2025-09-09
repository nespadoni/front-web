import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';

// Interface para tipagem dos dados de registro do usuário
interface UserRegistrationData {
  firstName: string;
  lastName: string;
  university: string;
  role: string;
  email: string;
  password: string;
}

// Tipo para as chaves das mensagens de erro
type ErrorMessageKey =
  'firstName'
  | 'lastName'
  | 'university'
  | 'role'
  | 'email'
  | 'password'
  | 'confirmPassword'
  | 'acceptTerms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;

  // Mensagens de erro personalizadas para cada campo
  private readonly ERROR_MESSAGES: Record<ErrorMessageKey, string> = {
    firstName: 'Nome é obrigatório',
    lastName: 'Sobrenome é obrigatório',
    university: 'Universidade é obrigatória',
    role: 'Função é obrigatória',
    email: 'Email é obrigatório',
    password: 'Senha é obrigatória',
    confirmPassword: 'Confirmação de senha é obrigatória',
    acceptTerms: 'Você deve aceitar os termos'
  };

  // Expressões regulares para validação de força da senha
  private readonly PASSWORD_REGEX = {
    number: /[0-9]/,
    upper: /[A-Z]/,
    lower: /[a-z]/,
    special: /[#?!@$%^&*-]/
  } as const;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router
  ) {
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  // Manipula o envio do formulário
  onSubmit(): void {
    if (this.registerForm.valid) {
      this.handleValidSubmission();
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  // Registro via Google OAuth
  signUpWithGoogle(): void {
    if (this.isLoading) return;
    console.log('Google Sign Up');
  }

  // Registro via Apple Sign In
  signUpWithApple(): void {
    if (this.isLoading) return;
    console.log('Apple Sign Up');
  }

  // Verifica se um campo específico tem erro e foi tocado
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }

  // Retorna a mensagem de erro apropriada para um campo
  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);

    if (!field?.errors || !field.touched) {
      return this.getPasswordMismatchError(fieldName);
    }

    const errors = field.errors;

    if (errors['required']) {
      return this.ERROR_MESSAGES[fieldName as ErrorMessageKey] || 'Campo obrigatório';
    }

    if (errors['email']) {
      return 'Email inválido';
    }

    if (errors['minlength']) {
      return `Deve ter pelo menos ${errors['minlength'].requiredLength} caracteres`;
    }

    if (errors['weakPassword']) {
      return 'Senha deve conter: maiúscula, minúscula, número e símbolo';
    }

    return this.getPasswordMismatchError(fieldName);
  }

  // Configura o formulário reativo com validações
  private initializeForm(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      university: ['', [Validators.required]],
      role: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordStrengthValidator.bind(this)
      ]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator.bind(this)
    });
  }

  // Validador customizado: verifica se senha e confirmação coincidem
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password?.value && confirmPassword?.value && password.value !== confirmPassword.value) {
      return {passwordMismatch: true};
    }

    return null;
  }

  // Validador customizado: verifica força da senha
  private passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;

    if (!password) {
      return null;
    }

    const isValid = Object.values(this.PASSWORD_REGEX).every(regex => regex.test(password));

    return isValid ? null : {weakPassword: true};
  }

  // Retorna erro específico para senhas que não coincidem
  private getPasswordMismatchError(fieldName: string): string {
    if (fieldName === 'confirmPassword' && this.registerForm.errors?.['passwordMismatch']) {
      return 'Senhas não coincidem';
    }
    return '';
  }

  // Processa formulário válido e simula envio para API
  private handleValidSubmission(): void {
    this.isLoading = true;

    const formData: UserRegistrationData = {
      firstName: this.registerForm.get('firstName')?.value,
      lastName: this.registerForm.get('lastName')?.value,
      university: this.registerForm.get('university')?.value,
      role: this.registerForm.get('role')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value
    };

    console.log('Register:', formData);

    // Simula delay de API e redireciona para login
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/login'], {
        queryParams: {message: 'Account created successfully! Please sign in.'}
      });
    }, 2000);
  }

  // Marca todos os campos como tocados para exibir erros
  private markAllFieldsAsTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsTouched();
    });
  }
}
