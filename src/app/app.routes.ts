import {Routes} from '@angular/router';
import {Login} from './features/auth/login/login';
import {Register} from './features/auth/register/register';
import {TeamManagement} from './features/dashboard/team-management/team-management';
import {Home} from './features/feed/home/home';

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
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
