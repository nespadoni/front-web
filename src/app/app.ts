import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent implements OnInit {
  isAuthRoute = false;

  constructor(private router: Router) {
  }

  ngOnInit() {
    // Escuta mudanças de rota
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Lista das páginas que NÃO devem ter sidebar
        const authRoutes = ['/login', '/register'];
        this.isAuthRoute = authRoutes.some(route => event.urlAfterRedirects.includes(route));
      });
  }
}
