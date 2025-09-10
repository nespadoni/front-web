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

export const routes: Routes = [
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'team-management',
    component: TeamManagement
  },
  {
    path: 'home',
    component: Home
  },
  {
    path: 'live-matches',
    component: LiveMatchesComponent
  },
  {
    path: 'highlights',
    component: HighlightsComponent
  },
  {
    path: 'leaderboards',
    component: LeaderboardsComponent
  },
  {
    path: 'tournaments',
    component: TournamentsComponent
  },
  {
    path: 'matches',
    component: MatchesComponent
  },
  {
    path: 'calendar',
    component: CalendarComponent
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
