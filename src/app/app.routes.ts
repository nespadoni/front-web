import {Routes} from '@angular/router';
import {Login} from './features/auth/login/login';
import {Register} from './features/auth/register/register';
import {TeamManagement} from './features/dashboard/team-management/team-management';
import {Home} from './features/feed/home/home';
import {LiveMatchesComponent} from './pages/arena/live-matches/live-matches';
import {TournamentsComponent} from './pages/competitions/tournaments/tournaments';
import {MatchesComponent} from './pages/competitions/matches/matches';
import {CalendarComponent} from './pages/competitions/calendar/calendar';
import {HighlightsComponent} from './pages/arena/highlights/highlights';
import {LeaderboardsComponent} from './pages/arena/leaderboards/leaderboards';
import {publicGuard} from './features/auth/public.guard';
import {authGuard} from './features/auth/auth.guard';

export const routes: Routes = [
  // Rotas públicas (acessíveis apenas se NÃO estiver logado)
  {
    path: 'login',
    component: Login,
    canActivate: [publicGuard]
  },
  {
    path: 'register',
    component: Register,
    canActivate: [publicGuard]
  },

  // Rotas protegidas
  {
    path: 'team-management',
    component: TeamManagement,
    canActivate: [authGuard]
  },


  {
    path: 'home',
    component: Home,
    canActivate: [authGuard]
  },
  {
    path: 'live-matches',
    component: LiveMatchesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'highlights',
    component: HighlightsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'leaderboards',
    component: LeaderboardsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'tournaments',
    component: TournamentsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'matches',
    component: MatchesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'calendar',
    component: CalendarComponent,
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
