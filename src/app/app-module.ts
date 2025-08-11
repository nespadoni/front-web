import {NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing-module';
import {AppComponent} from './app';
import {Login} from './features/auth/login/login';
import {Post} from './features/feed/post/post';
import {TeamManagement} from './features/dashboard/team-management/team-management';
import {Register} from './features/auth/register/register';
import {ReactiveFormsModule} from '@angular/forms';
import {Settings} from './features/settings/settings';
import {Athletic} from './features/profile/athletic/athletic';
import {User} from './features/profile/user/user';
import {SidebarComponent} from './layouts/sidebar/sidebar';
import {Footer} from './layouts/footer/footer';

@NgModule({
  declarations: [
    AppComponent,
    Login,
    Post,
    TeamManagement,
    Register,
    Settings,
    Athletic,
    User,
    SidebarComponent,
    Footer
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
  bootstrap: [AppComponent]
})
export class AppModule {
}
