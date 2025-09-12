import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, tap, timeout, retry, firstValueFrom} from 'rxjs';
import {jwtDecode} from 'jwt-decode';

// Interface para os dados do usuário
export interface User {
  id: number;
  name: string;
  email: string;
  profile_photo_url?: string;
  global_role?: string; // Role do usuário
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  telephone: string;
  universityId?: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User; // Esperamos o usuário na resposta
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public readonly baseUrl = 'http://localhost:8080'; // URL base para imagens
  private readonly apiUrl = 'http://localhost:8080/api';
  private readonly TOKEN_KEY = 'authToken';

  // BehaviorSubject para armazenar e emitir os dados do usuário
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Control de inicialização
  private initializationSubject = new BehaviorSubject<boolean>(false);
  public initialized$ = this.initializationSubject.asObservable();

  private isInitializing = false;

  constructor(private readonly http: HttpClient) {
    this.loadInitialUser(); // Carrega o usuário ao iniciar a aplicação
  }

  /**
   * Retorna o valor atual do usuário logado.
   */
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verifica se a inicialização foi concluída
   */
  public get isInitialized(): boolean {
    return this.initializationSubject.value;
  }

  /**
   * Aguarda a inicialização ser concluída
   */
  public async waitForInitialization(): Promise<void> {
    if (this.isInitialized) {
      return Promise.resolve();
    }

    return firstValueFrom(
      this.initialized$.pipe(
        timeout(10000) // 10 segundos de timeout máximo
      )
    ).then(() => {
    });
  }

  register(formData: FormData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, formData);
  }

  login(credentials: UserLoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        // Validação rigorosa da resposta da API
        if (!response || !response.token || !response.user) {
          // Se a resposta for inválida, lança um erro que será capturado no .subscribe()
          throw new Error('Resposta de autenticação inválida do servidor.');
        }

        // Se a resposta for válida, armazena os dados
        this.storeToken(response.token);
        this.currentUserSubject.next(response.user);
        this.setInitialized(true); // Marca como inicializado após login
        console.log('✅ Login realizado, usuário definido:', response.user);
      })
    );
  }

  storeToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const hasToken = !!this.getToken();
    const hasUser = !!this.currentUserValue;
    console.log('🔍 isLoggedIn check:', {hasToken, hasUser, initialized: this.isInitialized});
    return hasToken;
  }

  logout(): void {
    console.log('🚪 Fazendo logout...');
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null); // Limpa os dados do usuário
    this.setInitialized(true); // Marca como inicializado mesmo após logout
  }

  private setInitialized(value: boolean): void {
    if (!this.initializationSubject.value && value) {
      console.log('🎯 AuthService inicializado');
      this.initializationSubject.next(true);
    }
  }

  /**
   * Carrega os dados do usuário se um token válido existir.
   * Útil para quando o usuário recarrega a página.
   */
  private loadInitialUser(): void {
    if (this.isInitializing) {
      return; // Evita execuções múltiplas
    }

    this.isInitializing = true;
    const token = this.getToken();
    console.log('🔄 loadInitialUser executado, token existe:', !!token);

    if (token) {
      try {
        const decodedToken: { user_id: number } = jwtDecode(token);
        const userId = decodedToken.user_id;
        console.log('🔑 Token decodificado, user_id:', userId);

        // Evita buscas desnecessárias se o usuário já estiver carregado
        if (this.currentUserValue && this.currentUserValue.id === userId) {
          console.log('👤 Usuário já carregado, pulando busca');
          this.setInitialized(true);
          this.isInitializing = false;
          return;
        }

        console.log('📡 Buscando dados do usuário do servidor...');
        this.http.get<User>(`${this.apiUrl}/users/${userId}`).pipe(
          timeout(10000), // 10 segundos de timeout
          retry(2) // Tenta 2 vezes em caso de falha
        ).subscribe({
          next: user => {
            console.log('✅ Dados do usuário carregados:', user);
            this.currentUserSubject.next(user);
            this.setInitialized(true);
            this.isInitializing = false;
          },
          error: (error) => {
            console.error('❌ Erro ao carregar usuário:', error);
            console.log('🚪 Token inválido, fazendo logout...');
            this.logout(); // Se o token for inválido, desloga
            this.setInitialized(true);
            this.isInitializing = false;
          }
        });
      } catch (error) {
        console.error('❌ Erro ao decodificar token:', error);
        this.logout(); // Token inválido
        this.setInitialized(true);
        this.isInitializing = false;
      }
    } else {
      console.log('🔒 Nenhum token encontrado');
      // Garante que o subject emita null quando não há token
      this.currentUserSubject.next(null);
      this.setInitialized(true);
      this.isInitializing = false;
    }
  }
}
