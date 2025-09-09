import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {filter} from 'rxjs/operators';
import {SidebarComponent} from './layouts/sidebar/sidebar';
import {Socialbar} from './layouts/socialbar/socialbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    Socialbar
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent implements OnInit {
  title = 'rivaly';

  public showSidebars: boolean = true;

  private readonly routesWithoutSidebars: string[] = [
    '/login',
    '/register',
    '/forgot-password',
    '/terms'
  ];

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkRoute(event.url);
      });

    this.checkRoute(this.router.url);
  }

  private checkRoute(url: string): void {
    const cleanUrl = url.split('?')[0].split('#')[0];
    this.showSidebars = !this.routesWithoutSidebars.some(route =>
      cleanUrl === route || cleanUrl.startsWith(route + '/')
    );

    console.log('Rota atual:', cleanUrl);
    console.log('Mostrar sidebars:', this.showSidebars);
  }
}
