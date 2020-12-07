import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { StoreModule } from "@ngrx/store";
import { NotificationAnimationType, SimpleNotificationsModule } from 'angular2-notifications';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from "./app.component";
import { SidemenuComponent } from './components/common/sidemenu/sidemenu.component';
import { LayoutComponent } from './components/common/layout/layout.component';
import { TopmenuComponent } from './components/common/topmenu/topmenu.component';
import { AuthApiClient } from './services/api/auth-api-client.service';
import { SigninComponent } from "./components/auth/signin/signin.component";
import { SignupComponent } from './components/auth/signup/signup.component';
import { AppRoutingModule } from './app.routing.module';
import { ExploreComponent } from './components/common/explore/explore.component';
import { BookmarksComponent } from './components/common/bookmarks/bookmarks.component';
import { HomeComponent } from './components/common/home/home.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { SettingsComponent } from './components/user/settings/settings.component';
import { NotFoundComponent } from './components/common/not-found/not-found.component';
import { ApiClient } from './services/api/api-client.service';
import { reducers } from './state';
import { AuthEffects } from './state/auth/effects';
import { TweetCommentEffects } from "./state/tweet-comment/effects";
import { RequestInterceptor } from './services/interceptors/request-interceptor.service';
import { NotificationService } from './services/utils/notification.service';
import { TweetDetailsComponent } from './components/tweet/tweet-details/tweet-details.component';
import { TweetCreationComponent } from './components/tweet/tweet-creation/tweet-creation.component';
import { MediaComponent } from './components/common/ui/media/media.component';
import { TweetCommentSectionComponent } from './components/tweet/tweet-comment-section/tweet-comment-section.component';
import { AutoHeightDirective } from './directives/auto-height.directive';
import { TrendsComponent } from './components/tweet/trends/trends.component';
import { RecommendedUsersComponent } from './components/user/recommended-users/recommended-users.component';
import { DropdownComponent } from './components/common/ui/dropdown/dropdown.component';
import { TweetEffects } from './state/tweet/effects';
import { TweetApiClient } from './services/api/tweet-api-client.service';
import { TweetsFeedComponent } from './components/tweet/tweets-feed/tweets-feed.component';
import { TweetCommentApiClient } from './services/api/tweet-comment-api-client.service';
import { BaseComponent } from './components/common/base-component/base-component.component';
import { UserApiClient } from './services/api/user-api-client.service';
import { UserEffects } from './state/user/effects';
import { UsersListComponent } from './components/user/users-list/users-list.component';
import { ModalComponent } from './components/common/ui/modal/modal.component';
import { ScrollPositionService } from './services/utils/scroll-position.service';
import { NumberShortenerPipe } from './pipes/number-shortener.pipe';

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
    NotFoundComponent,
    TweetDetailsComponent,
    TweetCreationComponent,
    MediaComponent,
    TweetCommentSectionComponent,
    AutoHeightDirective,
    TrendsComponent,
    RecommendedUsersComponent,
    DropdownComponent,
    TweetsFeedComponent,
    BaseComponent,
    UsersListComponent,
    ModalComponent,
    NumberShortenerPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot(reducers, {
      runtimeChecks: {
        strictActionImmutability: false,
      },
    }),
    EffectsModule.forRoot([AuthEffects, TweetEffects, TweetCommentEffects, UserEffects]),
    SimpleNotificationsModule.forRoot({position: ["top", "right"], timeOut: 4000, animate: NotificationAnimationType.FromTop}),
    BrowserAnimationsModule,
  ],
  providers: [
    AuthApiClient,
    ApiClient,
    TweetApiClient,
    TweetCommentApiClient,
    UserApiClient,
    ScrollPositionService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    },
    NotificationService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
