import {Component, Inject, OnInit, Renderer2} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent implements OnInit {
  // Propriedades do user sidebar
  isSettingsOpen: boolean = false;
  isDarkMode: boolean = true;

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

  // Métodos do user sidebar
  toggleSettings() {
    this.isSettingsOpen = !this.isSettingsOpen;
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  closeSettings() {
    this.isSettingsOpen = false;
  }

  // Método para quando clicar no overlay
  onOverlayClick(event: Event) {
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
