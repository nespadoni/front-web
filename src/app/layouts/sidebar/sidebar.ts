import {Component, Inject, OnInit, Renderer2} from '@angular/core';
import {CommonModule, DOCUMENT} from '@angular/common';
import {Router, RouterLink} from '@angular/router'; // Adicionar RouterLink
import {ModalService} from '../../core/services/modal.service';
import {AuthService, User} from '../../features/auth/auth.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink // Adicionar import do RouterLink
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent implements OnInit {
  isSettingsOpen: boolean = false;
  isDarkMode: boolean = true;
  currentUser$: Observable<User | null>; // Observable para os dados do usuário
  baseUrl: string;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthService,
    private modalService: ModalService,
    private router: Router
  ) {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme ? savedTheme === 'dark' : true;
    this.applyTheme();

    // Atribui o observable do serviço à propriedade do componente
    this.currentUser$ = this.authService.currentUser$;
    this.baseUrl = this.authService.baseUrl;
  }

  ngOnInit(): void {
  }

  getUserProfilePhotoUrl(user: User): string {
    if (!user.profile_photo_url) {
      return '/assets/images/avatars/default-avatar.png';
    }

    // Se a URL já começar com http, usar diretamente
    if (user.profile_photo_url.startsWith('http')) {
      return user.profile_photo_url;
    }

    // Se começar com /, concatenar com baseUrl
    if (user.profile_photo_url.startsWith('/')) {
      return this.baseUrl + user.profile_photo_url;
    }

    // Caso contrário, assumir que é um caminho relativo
    return this.baseUrl + '/' + user.profile_photo_url;
  }

  toggleSettings(): void {
    this.isSettingsOpen = !this.isSettingsOpen;
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  closeSettings(): void {
    this.isSettingsOpen = false;
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeSettings();
    }
  }

  onLogout(): void {
    this.modalService.openConfirmationModal(
      {
        title: 'Confirmar Logout',
        message: 'Tem certeza que deseja sair da sua conta? Você será redirecionado para a tela de login.',
        confirmText: 'Sim, Sair',
        cancelText: 'Cancelar',
        type: 'danger'
      },
      () => this.executeLogout()
    );
  }

  private executeLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private applyTheme(): void {
    const body = this.document.body;
    if (this.isDarkMode) {
      body.setAttribute('data-theme', 'dark');
    } else {
      body.setAttribute('data-theme', 'light');
    }
  }
}
