import {Routes} from '@angular/router';
import {Login} from './features/auth/login/login';
import {Register} from './features/auth/register/register';
import {TeamManagement} from './features/dashboard/team-management/team-management';
import {Home} from './features/feed/home/home';
import {LiveMatchesComponent} from './features/arena/live-matches/live-matches';
import {HighlightsComponent} from './features/arena/highlights/highlights';
import {LeaderboardsComponent} from './features/arena/leaderboards/leaderboards';
import {TournamentsComponent} from './features/competitions/tournaments/tournaments';

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
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
