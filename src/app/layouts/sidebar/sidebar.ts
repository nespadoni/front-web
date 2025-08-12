import {Component, Inject, OnInit, Renderer2} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent implements OnInit {
  isMinimized = false;
  isAnimating = false;

  // Propriedades do user sidebar
  isSettingsOpen: boolean = false;
  isDarkMode: boolean = true;

  // Flag para prevenir duplos cliques
  private isTogglingSidebar = false;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    // Carrega o tema salvo no localStorage
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme ? savedTheme === 'dark' : true;
    this.applyTheme();
  }

  ngOnInit(): void {
  }

  toggleSidebar() {
    if (this.isTogglingSidebar) return;

    this.isTogglingSidebar = true;
    this.isAnimating = true;

    setTimeout(() => {
      this.isMinimized = !this.isMinimized;

      const body = this.document.body;
      if (this.isMinimized) {
        this.renderer.addClass(body, 'sidebar-minimized');
        // Se minimizar, fecha as configurações
        this.isSettingsOpen = false;
      } else {
        this.renderer.removeClass(body, 'sidebar-minimized');
      }

      setTimeout(() => {
        this.isAnimating = false;
        this.isTogglingSidebar = false;
      }, 100);
    }, 100);
  }

  // Métodos do user sidebar - sem prevenção de eventos
  toggleSettings() {
    if (this.isAnimating) return;

    console.log('Toggle settings clicked, current state:', this.isSettingsOpen);
    this.isSettingsOpen = !this.isSettingsOpen;
    console.log('New state:', this.isSettingsOpen);
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    console.log('Theme toggled to:', this.isDarkMode ? 'dark' : 'light');
  }

  closeSettings() {
    console.log('Closing settings');
    this.isSettingsOpen = false;
  }

  // Método para quando clicar no overlay
  onOverlayClick(event: Event) {
    // Só fecha se o clique foi exatamente no overlay
    if (event.target === event.currentTarget) {
      this.closeSettings();
    }
  }

  private applyTheme() {
    const body = document.body;
    if (this.isDarkMode) {
      body.setAttribute('data-theme', 'dark');
    } else {
      body.setAttribute('data-theme', 'light');
    }
  }
}
