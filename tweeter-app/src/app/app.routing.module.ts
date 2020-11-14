import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SigninComponent } from './components/auth/signin/signin.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { BookmarksComponent } from './components/common/bookmarks/bookmarks.component';
import { ExploreComponent } from './components/common/explore/explore.component';
import { HomeComponent } from './components/common/home/home.component';
import { LayoutComponent } from './components/common/layout/layout.component';
import { NotFoundComponent } from './components/common/not-found/not-found.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { SettingsComponent } from './components/user/settings/settings.component';
import { AuthGuard } from './services/guards/auth-guard';

export const routes: Routes = [
    { path: "signin", component: SigninComponent },
    { path: "signup", component: SignupComponent },
    {
        path: "", component: LayoutComponent, canActivate: [AuthGuard], children: [
            { path: "", redirectTo: "home", pathMatch: "full" },

            { path: "home", component: HomeComponent },
            { path: "settings", component: SettingsComponent },

            { path: "explore", redirectTo: "explore/top", pathMatch: "full" },
            { path: "explore/top", component: ExploreComponent, data: { filter: "top" } },
            { path: "explore/latest", component: ExploreComponent, data: { filter: "latest" } },
            { path: "explore/people", component: ExploreComponent, data: { filter: "people" } },
            { path: "explore/media", component: ExploreComponent, data: { filter: "media" } },

            { path: "bookmarks", redirectTo: "bookmarks/tweets", pathMatch: "full" },
            { path: "bookmarks/tweets", component: BookmarksComponent, data: { filter: "tweets" } },
            { path: "bookmarks/tweets-and-replies", component: BookmarksComponent, data: { filter: "tweetsAndReplies" } },
            { path: "bookmarks/media", component: BookmarksComponent, data: { filter: "media" } },
            { path: "bookmarks/likes", component: BookmarksComponent, data: { filter: "likes" } },

            { path: "profile/:id", redirectTo: "profile/:id/tweets", pathMatch: "full" },
            { path: "profile/:id/tweets", component: ProfileComponent, data: { filter: "tweets" } },
            { path: "profile/:id/tweets-and-replies", component: ProfileComponent, data: { filter: "tweetsAndReplies" } },
            { path: "profile/:id/media", component: ProfileComponent, data: { filter: "media" } },
            { path: "profile/:id/likes", component: ProfileComponent, data: { filter: "likes" } },

            { path: "**", redirectTo: "/not-found" }
        ]
    },
    { path: "not-found", component: NotFoundComponent },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {

}
