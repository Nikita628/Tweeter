import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
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

  public signupForm: FormGroup;
  public isLoading = false;

  constructor(
    protected store: Store<IAppState>,
    private router: Router
  ) {
    super(store);
    this.authState$ = store.select("auth");
    this.signupForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      confirmation: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.authState$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((state) => {
      if (state.signupStatus === "error") {
        this.isLoading = false;
      } else if (state.signupStatus === "success") {
        this.router.navigate(["/signin"]);
      }
    });
  }

  public onSubmit(): void {
    this.isLoading = true;
    const signUpData = new SignUpData();
    signUpData.email = this.signupForm.value.email;
    signUpData.name = this.signupForm.value.username;
    signUpData.password = this.signupForm.value.password;
    this.store.dispatch(actionCreators.signup(signUpData));
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(actionCreators.clearSignupStatus());
  }

  // private validateConfirmation(control: AbstractControl): ValidationErrors {
  //   if (control.parent && control.parent.value.password !== control.value) {
  //     return { message: "Confirmation does not match" };
  //   }
  //   control.parent?.value?.password?.setErrors(null);
  //   return null;
  // }
}
