import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {filter} from 'rxjs/operators';
import {CommonModule} from '@angular/common';
import {ConfirmationModalComponent} from './shared/components/confirmation-modal/confirmation-modal.component';
import {SidebarComponent} from './layouts/sidebar/sidebar';
import {Socialbar} from './layouts/socialbar/socialbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,
    RouterOutlet,
    ConfirmationModalComponent,
    SidebarComponent,
    Socialbar
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent implements OnInit {
  title = 'rivaly';

  public showSidebar: boolean = true;
  public showSocialbar: boolean = false;

  private readonly routesWithoutSidebar: string[] = [
    '/login',
    '/register',
    '/forgot-password',
    '/terms'
  ];

  // Socialbar aparece APENAS na home
  private readonly routesWithSocialbar: string[] = [
    '/',
    '/home'
  ];

  constructor(private router: Router) {
    // Debug: Log inicial
    console.log('🔧 AppComponent constructor - URL inicial:', this.router.url);
  }

  ngOnInit(): void {
    // Verificar rota inicial
    this.checkRoute(this.router.url);
    console.log('🔧 ngOnInit - Estado inicial:', {
      showSidebar: this.showSidebar,
      showSocialbar: this.showSocialbar,
      currentUrl: this.router.url
    });

    // Escutar mudanças de rota
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        console.log('🔧 Navegação detectada:', event.url);
        this.checkRoute(event.url);
        console.log('🔧 Após checkRoute:', {
          showSidebar: this.showSidebar,
          showSocialbar: this.showSocialbar
        });
      });
  }

  private checkRoute(url: string): void {
    const cleanUrl = url.split('?')[0].split('#')[0];
    console.log('🔧 checkRoute chamado com URL:', cleanUrl);

    // Lógica para Sidebar (todas exceto auth)
    const shouldShowSidebar = !this.routesWithoutSidebar.some(route =>
      cleanUrl === route || cleanUrl.startsWith(route + '/')
    );

    // Lógica para Socialbar (APENAS /home)
    const shouldShowSocialbar = this.routesWithSocialbar.some(route =>
      cleanUrl === route || cleanUrl.startsWith(route + '/')
    );

    console.log('🔧 Calculados:', {shouldShowSidebar, shouldShowSocialbar});

    // Atualizar estado
    this.showSidebar = shouldShowSidebar;
    this.showSocialbar = shouldShowSocialbar;

    console.log('🔧 Estado final:', {
      showSidebar: this.showSidebar,
      showSocialbar: this.showSocialbar
    });
  }
}
