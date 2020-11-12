import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from '@angular/forms';

import { AppComponent } from "./app.component";
import { SidemenuComponent } from './components/common/sidemenu/sidemenu.component';
import { LayoutComponent } from './components/common/layout/layout.component';
import { TopmenuComponent } from './components/common/topmenu/topmenu.component';
import { AuthApiClient } from './services/auth-api-client.service';
import { SigninComponent } from "./components/auth/signin/signin.component";
import { SignupComponent } from './components/auth/signup/signup.component';
import { AppRoutingModule } from './app.routing.module';
import { ExploreComponent } from './components/common/explore/explore.component';
import { BookmarksComponent } from './components/common/bookmarks/bookmarks.component';
import { HomeComponent } from './components/common/home/home.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { SettingsComponent } from './components/user/settings/settings.component';
import { NotFoundComponent } from './components/common/not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    SidemenuComponent,
    LayoutComponent,
    TopmenuComponent,
    ExploreComponent,
    BookmarksComponent,
    HomeComponent,
    ProfileComponent,
    SettingsComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    AuthApiClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
