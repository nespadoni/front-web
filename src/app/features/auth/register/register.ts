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
import {Router, RouterLink} from '@angular/router'; // Adicionar RouterLink
import {AuthService, RegisterRequest} from '../auth.service';
import {University} from '../../../shared/models/university/university.interface';
import {UniversityService} from '../../../shared/models/university/university.service';
import {PhotoUploadModal} from '../../../shared/components/photo-upload-modal/photo-upload-modal';

type ErrorMessageKey =
  'firstName'
  | 'lastName'
  | 'university'
  | 'email'
  | 'password'
  | 'confirmPassword'
  | 'acceptTerms'
  | 'telephone';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink, // Adicionar RouterLink
    PhotoUploadModal
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  universities: University[] = [];
  isLoading = false;
  isLoadingUniversities = true;
  errorMessage: string | null = null;
  showPhotoModal = false;
  private registrationPayload: RegisterRequest | null = null;

  private readonly ERROR_MESSAGES: Record<ErrorMessageKey, string> = {
    firstName: 'Nome é obrigatório',
    lastName: 'Sobrenome é obrigatório',
    university: 'Universidade é obrigatória',
    email: 'Email é obrigatório',
    telephone: 'Telefone é obrigatório',
    password: 'Senha é obrigatória',
    confirmPassword: 'Confirmação de senha é obrigatória',
    acceptTerms: 'Você deve aceitar os termos'
  };

  private readonly PASSWORD_REGEX = {
    number: /[0-9]/,
    upper: /[A-Z]/,
    lower: /[a-z]/,
    special: /[#?!@$%^&*-]/
  } as const;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly universityService: UniversityService
  ) {
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadUniversities();
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (this.registerForm.valid) {
      // 1. Armazena os dados do formulário
      const universityId = this.registerForm.get('university')?.value;
      this.registrationPayload = {
        name: `${this.registerForm.get('firstName')?.value} ${this.registerForm.get('lastName')?.value}`.trim(),
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value,
        telephone: this.registerForm.get('telephone')?.value,
        ...(universityId !== 'none' && {universityId})
      };

      // 2. Abre o modal da foto instantaneamente
      this.showPhotoModal = true;
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  signUpWithGoogle(): void {
    if (this.isLoading) return;
    console.log('Google Sign Up');
  }

  signUpWithApple(): void {
    if (this.isLoading) return;
    console.log('Apple Sign Up');
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }

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

  onPhotoSelected(file: File): void {
    this.finalizeRegistration(file);
  }

  finalizeRegistration(photo: File): void {
    if (!this.registrationPayload) {
      this.errorMessage = 'Ocorreu um erro. Por favor, preencha o formulário novamente.';
      return;
    }

    this.isLoading = true;
    const formData = new FormData();

    // Adiciona os dados do usuário ao FormData
    Object.keys(this.registrationPayload).forEach(key => {
      const value = (this.registrationPayload as any)[key];
      if (value) {
        formData.append(key, value);
      }
    });

    // Adiciona a foto
    formData.append('profilePhoto', photo, photo.name);

    // Chama o novo método do serviço de autenticação
    this.authService.register(formData).subscribe({
      next: () => {
        console.log('Registro finalizado com sucesso!');
        this.isLoading = false;
        this.showPhotoModal = false;
        this.router.navigate(['/login'], {
          queryParams: {message: 'Conta criada com sucesso! Por favor, faça o login.'}
        });
      },
      error: (err) => {
        console.error('Erro na finalização do registro:', err);
        // Exibe o erro na tela de registro, não no modal
        this.errorMessage = err.error?.message || 'Ocorreu um erro no registro. Tente novamente.';
        this.isLoading = false;
        this.showPhotoModal = false; // Fecha o modal em caso de erro
      }
    });
  }

  onPhotoModalClosed(): void {
    if (!this.isLoading) {
      this.showPhotoModal = false;
      this.registrationPayload = null;
    }
  }

  private initializeForm(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      university: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required]],
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

  private loadUniversities(): void {
    this.isLoadingUniversities = true;
    this.universityService.getAllUniversities().subscribe({
      next: (universities) => {
        this.universities = universities;
      },
      error: (error) => {
        console.error('Erro ao carregar universidades:', error);
        this.universities = [];
      },
      complete: () => {
        this.isLoadingUniversities = false;
      }
    });
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    return password?.value === confirmPassword?.value ? null : {passwordMismatch: true};
  }

  private passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    if (!password) return null;
    const isValid = Object.values(this.PASSWORD_REGEX).every(regex => regex.test(password));
    return isValid ? null : {weakPassword: true};
  }

  private getPasswordMismatchError(fieldName: string): string {
    if (fieldName === 'confirmPassword' && this.registerForm.errors?.['passwordMismatch']) {
      return 'Senhas não coincidem';
    }
    return '';
  }

  private markAllFieldsAsTouched(): void {
    Object.values(this.registerForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}
