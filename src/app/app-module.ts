import {NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing-module';
import {App} from './app';
import {Login} from './features/auth/login/login';
import {Post} from './features/feed/post/post';
import {TeamManagement} from './features/dashboard/team-management/team-management';
import {Register} from './features/auth/register/register';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    App,
    Login,
    Post,
    TeamManagement,
    Register
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
  ],
  bootstrap: [App]
})
export class AppModule {
}
