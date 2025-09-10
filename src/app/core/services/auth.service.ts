import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {
  }

  logout(): void {
    // Implementar lógica de logout (limpar tokens, etc.)
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    // Adicione aqui outras limpezas necessárias
    console.log('Usuário deslogado com sucesso');
  }

  isLoggedIn(): boolean {
    // Implementar verificação se o usuário está logado
    return !!localStorage.getItem('authToken');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }
}
