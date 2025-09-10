import {Component, Inject, OnInit, Renderer2} from '@angular/core';
import {CommonModule, DOCUMENT} from '@angular/common';
import {Router} from '@angular/router';
import {AuthService} from '../../core/services/auth.service';
import {ModalService} from '../../core/services/modal.service';
import {ConfirmationModalComponent} from '../../shared/components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, ConfirmationModalComponent],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent implements OnInit {
  isSettingsOpen: boolean = false;
  isDarkMode: boolean = true;

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
  }

  ngOnInit(): void {
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
        type: 'danger' // 👈 MUDEI PARA DANGER (VERMELHO)
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
