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
    }
  }

  signInWithGoogle(): void {
    console.log('Google Sign In');
  }

  signInWithApple(): void {
    console.log('Apple Sign In');
  }
}
