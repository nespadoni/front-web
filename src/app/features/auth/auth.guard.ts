import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from './auth.service';
import {Observable, of} from 'rxjs';
import {map, catchError} from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🔒 authGuard executado para rota:', state.url);

  // Se o serviço ainda não foi inicializado, aguarda
  if (!authService.isInitialized) {
    console.log('🔒 Aguardando inicialização do AuthService...');
    return new Observable(observer => {
      authService.waitForInitialization().then(() => {
        console.log('🔒 Inicialização concluída, verificando autenticação...');

        // Após inicialização, verifica se está autenticado
        if (authService.isLoggedIn() && authService.currentUserValue) {
          console.log('🔒 Usuário autenticado, permitindo acesso');
          observer.next(true);
        } else {
          console.log('🔒 Usuário não autenticado, redirecionando para login');
          observer.next(router.createUrlTree(['/login']));
        }
        observer.complete();
      }).catch(error => {
        console.error('🔒 Erro na inicialização:', error);
        observer.next(router.createUrlTree(['/login']));
        observer.complete();
      });
    });
  }

  // Se já foi inicializado, faz a verificação direta
  console.log('🔒 AuthService já inicializado');

  if (authService.isLoggedIn() && authService.currentUserValue) {
    console.log('🔒 Usuário autenticado, permitindo acesso');
    return true;
  } else {
    console.log('🔒 Usuário não autenticado, redirecionando para login');
    return router.createUrlTree(['/login']);
  }
};
