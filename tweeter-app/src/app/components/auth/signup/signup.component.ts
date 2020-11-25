import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SignUpData } from 'src/app/models/Auth';
import { IAppState } from 'src/app/state';
import { actionCreators } from 'src/app/state/auth/actions';
import { IAuthState } from 'src/app/state/auth/reducer';
import { BaseComponent } from '../../common/base-component/base-component.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent extends BaseComponent implements OnInit, OnDestroy {
  private authState$: Observable<IAuthState>;
  private readonly emailRegex = /.*@.*\.[A-Za-z]{2,10}/;

  public isSubmitDisabled = false;
  public isAlreadySubmitted = false;
  public isLoading = false;
  public name = "";
  public email = "";
  public password = "";
  public confirmation = "";

  public nameError = null;
  public emailError = null;
  public passwordError = null;
  public confirmationError = null;

  constructor(
    protected store: Store<IAppState>,
    private router: Router
  ) {
    super(store);
    this.authState$ = store.select("auth");
  }

  ngOnInit(): void {
    this.authState$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((state) => {
      if (state.signupStatus === "error") {
        this.isLoading = false;
        this.isSubmitDisabled = false;
      } else if (state.signupStatus === "success") {
        this.router.navigate(["/signin"]);
      }
    });
  }

  public onNameChange(name: string): void {
    this.name = name;
    if (this.isAlreadySubmitted) {
      this.validate();
    }
  }

  public onEmailChange(email: string): void {
    this.email = email;
    if (this.isAlreadySubmitted) {
      this.validate();
    }
  }

  public onPasswordChange(password: string): void {
    this.password = password;
    if (this.isAlreadySubmitted) {
      this.validate();
    }
  }

  public onConfirmationChange(confirmation: string): void {
    this.confirmation = confirmation;
    if (this.isAlreadySubmitted) {
      this.validate();
    }
  }

  public onSubmit(): void {
    this.isAlreadySubmitted = true;
    this.validate();
    if (!this.isSubmitDisabled) {
      this.isSubmitDisabled = true;
      this.isLoading = true;
      const signUpData = new SignUpData();
      signUpData.email = this.email;
      signUpData.name = this.name;
      signUpData.password = this.password;
      this.store.dispatch(actionCreators.signup(signUpData));
    }
  }

  private validate(): void {
    if (this.name && this.name.length >= 4) {
      this.nameError = null;
    } else {
      this.nameError = "Name should be at least 4 characters long";
    }

    if (this.email && this.emailRegex.test(this.email)) {
      this.emailError = null;
    } else {
      this.emailError = "Please input a valid email";
    }

    if (this.password && this.password.length >= 4) {
      this.passwordError = null;
    } else {
      this.passwordError = "Password should be at least 4 characters long";
    }

    if (this.confirmation && this.confirmation === this.password) {
      this.confirmationError = null;
    } else {
      this.confirmationError = "Confirmation does not match the password";
    }

    this.setIsSubmitDisabled();
  }

  private setIsSubmitDisabled(): void {
    this.isSubmitDisabled = this.nameError
      || this.emailError
      || this.passwordError
      || this.confirmationError;
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(actionCreators.clearSignupStatus());
  }
}
