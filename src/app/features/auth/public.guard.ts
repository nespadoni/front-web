import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';

export const publicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🔓 publicGuard executado');

  // Se o serviço ainda não foi inicializado, aguarda
  if (!authService.isInitialized) {
    console.log('🔓 Aguardando inicialização do AuthService...');
    return new Observable(observer => {
      authService.waitForInitialization().then(() => {
        console.log('🔓 Inicialização concluída, verificando se deve bloquear acesso público...');

        // Após inicialização, verifica se está logado
        if (authService.isLoggedIn() && authService.currentUserValue) {
          console.log('🔓 Usuário já logado, redirecionando para home');
          router.navigate(['/home']);
          observer.next(false);
        } else {
          console.log('🔓 Usuário não logado, permitindo acesso à página pública');
          observer.next(true);
        }
        observer.complete();
      }).catch(error => {
        console.error('🔓 Erro na inicialização:', error);
        // Em caso de erro, permite acesso à página pública
        observer.next(true);
        observer.complete();
      });
    });
  }

  // Se já foi inicializado, faz a verificação direta
  console.log('🔓 AuthService já inicializado');

  if (authService.isLoggedIn() && authService.currentUserValue) {
    console.log('🔓 Usuário já logado, redirecionando para home');
    router.navigate(['/home']);
    return false;
  }

  console.log('🔓 Usuário não logado, permitindo acesso à página pública');
  return true;
};
