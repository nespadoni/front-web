import {Injectable, NgZone} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, tap, timeout, retry, firstValueFrom, catchError, of} from 'rxjs';
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
  public readonly baseUrl = 'https://backend-go-production-c4f4.up.railway.app'; // URL base para imagens
  private readonly apiUrl = 'https://backend-go-production-c4f4.up.railway.app/api';
  private readonly TOKEN_KEY = 'authToken';

  // BehaviorSubject para armazenar e emitir os dados do usuário
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Control de inicialização
  private initializationSubject = new BehaviorSubject<boolean>(false);
  public initialized$ = this.initializationSubject.asObservable();

  private isInitializing = false;

  constructor(private readonly http: HttpClient, private ngZone: NgZone) {
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
    const token = this.getToken();
    const hasToken = !!token && this.isTokenValid(token);
    const hasUser = !!this.currentUserValue;
    console.log('🔍 isLoggedIn check:', {hasToken, hasUser, initialized: this.isInitialized});
    return hasToken && hasUser;
  }

  logout(): void {
    console.log('🚪 Fazendo logout...');
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null); // Limpa os dados do usuário
    this.setInitialized(true); // Marca como inicializado mesmo após logout
  }

  /**
   * Método público para recarregar dados do usuário
   */
  public refreshUserData(): Observable<User | null> {
    const token = this.getToken();
    if (!token || !this.isTokenValid(token)) {
      return of(null);
    }

    try {
      const decodedToken: { user_id: number } = jwtDecode(token);
      const userId = decodedToken.user_id;

      return this.http.get<User>(`${this.apiUrl}/users/${userId}`).pipe(
        timeout(10000),
        tap(user => {
          if (user) {
            this.currentUserSubject.next(user);
          }
        }),
        catchError((error: HttpErrorResponse) => {
          this.handleUserLoadError(error, token);
          return of(null);
        })
      );
    } catch (error) {
      console.error('❌ Erro ao decodificar token:', error);
      this.logout();
      return of(null);
    }
  }

  /**
   * Verifica se um token JWT é válido (não expirado)
   */
  private isTokenValid(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    } catch (error) {
      console.error('🔑 Erro ao decodificar token:', error);
      return false;
    }
  }

  private setInitialized(value: boolean): void {
    if (!this.initializationSubject.value && value) {
      console.log('🎯 AuthService inicializado');
      this.initializationSubject.next(true);
    }
  }

  /**
   * Trata erros HTTP de forma mais granular
   */
  private handleUserLoadError(error: HttpErrorResponse, token: string): void {
    console.error('❌ Erro ao carregar usuário:', error);

    if (error.status === 401 || error.status === 403) {
      console.log('🚪 Token inválido/expirado, fazendo logout...');
      this.logout();
    } else if (error.status === 404) {
      console.log('⚠️ Usuário não encontrado, mas token válido - mantendo sessão');
      // Token válido mas usuário não existe - pode ser um problema temporário
      // Mantém a sessão mas sem dados do usuário
      this.currentUserSubject.next(null);
      this.setInitialized(true);
    } else if (error.status >= 500) {
      console.log('🔄 Erro do servidor, tentando novamente mais tarde');
      // Erro do servidor - mantém a sessão e pode tentar novamente
      this.currentUserSubject.next(null);
      this.setInitialized(true);
    } else {
      console.log('🚪 Erro não tratado, fazendo logout por segurança');
      this.logout();
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

    if (!token) {
      console.log('🔒 Nenhum token encontrado');
      this.currentUserSubject.next(null);
      this.setInitialized(true);
      this.isInitializing = false;
      return;
    }

    // Verifica se o token é válido antes de fazer a requisição
    if (!this.isTokenValid(token)) {
      console.log('🚪 Token expirado, fazendo logout...');
      this.logout();
      this.isInitializing = false;
      return;
    }

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

      // Executa dentro da zona do Angular para evitar erros
      this.ngZone.run(() => {
        this.http.get<User>(`${this.apiUrl}/users/${userId}`).pipe(
          timeout(10000), // 10 segundos de timeout
          retry(1), // Reduzido para 1 tentativa para evitar loops
          catchError((error: HttpErrorResponse) => {
            this.handleUserLoadError(error, token);
            this.isInitializing = false;
            return of(null); // Retorna null em caso de erro
          })
        ).subscribe({
          next: (user) => {
            if (user) {
              console.log('✅ Dados do usuário carregados:', user);
              this.currentUserSubject.next(user);
            }
            this.setInitialized(true);
            this.isInitializing = false;
          },
          error: (error) => {
            // Este bloco não deve ser executado devido ao catchError
            console.error('❌ Erro não tratado:', error);
            this.logout();
            this.setInitialized(true);
            this.isInitializing = false;
          }
        });
      });

    } catch (error) {
      console.error('❌ Erro ao decodificar token:', error);
      this.logout(); // Token inválido
      this.isInitializing = false;
    }
  }
}
