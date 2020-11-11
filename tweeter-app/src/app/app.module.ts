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
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: "", component: LayoutComponent },
  { path: "signin", component: SigninComponent },
  { path: "signup", component: SignupComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    SidemenuComponent,
    LayoutComponent,
    TopmenuComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    AuthApiClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
