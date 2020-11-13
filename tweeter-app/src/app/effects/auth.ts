import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action, Store } from '@ngrx/store';
import { NotificationsService } from 'angular2-notifications';
import { EMPTY } from 'rxjs';
import { catchError, mergeMap, switchMap, tap } from 'rxjs/operators';

import { ApiResponse } from '../models/Api';
import { SigninResult, SignUpData } from '../models/Auth';
import { IPayloadedAction } from '../models/Common';
import { AuthApiClient } from '../services/auth-api-client.service';
import { IAppState } from '../state';
import { actionCreators, actionTypes } from '../state/auth';

@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private authApi: AuthApiClient,
        private router: Router,
        private store: Store<IAppState>,
        private notification: NotificationsService
    ) { }

    @Effect()
    signin = this.actions$.pipe(
        ofType(actionTypes.signin),
        switchMap((action: Action & IPayloadedAction<{ email: string, password: string }>) => {
            return this.authApi.signIn(action.payload.email, action.payload.password)
                .pipe(
                    mergeMap((res: ApiResponse<SigninResult>) => {
                        if (!res.errors.length) {
                            localStorage.setItem("tweeter_token", res.item.token);
                            localStorage.setItem("tweeter_user", JSON.stringify(res.item.user));
                            const hourFromNow = new Date().getTime() + 3600000;
                            localStorage.setItem("tweeter_token_exp_date", hourFromNow.toString());
                            this.router.navigate(["/"]);
                            return [actionCreators.signinSuccess(res.item), actionCreators.autoSignout(3300000)];
                        }
                        this.notification.error("Error", res.errors[0]);
                        return [actionCreators.signinError()];
                    }),
                    catchError(() => {
                        this.notification.error("Error", "Error while logging in");
                        return [actionCreators.signinError()];
                    })
                );
        })
    );

    @Effect({ dispatch: false })
    autoSignout = this.actions$.pipe(
        ofType(actionTypes.autoSignout),
        tap((action: Action & IPayloadedAction<number>) => {
            setTimeout(() => {
                this.store.dispatch(actionCreators.signout());
            }, action.payload);
        })
    );

    @Effect()
    autoSignin = this.actions$.pipe(
        ofType(actionTypes.autoSignin),
        mergeMap((action: Action) => {
            const token = localStorage.getItem("tweeter_token");
            const user = JSON.parse(localStorage.getItem("tweeter_user"));
            const expDate = Number(localStorage.getItem("tweeter_token_exp_date"));
            const now = new Date().getTime();
            if (token  && user && expDate && expDate > now) {
                const signinRes = new SigninResult();
                signinRes.token = token;
                signinRes.user = user;
                return [actionCreators.signinSuccess(signinRes), actionCreators.autoSignout(expDate - now)];
            }
            localStorage.removeItem("tweeter_token");
            localStorage.removeItem("tweeter_user");
            localStorage.removeItem("tweeter_token_exp_date");
            this.router.navigate(["/signin"]);
            return EMPTY;
        })
    );

    @Effect({ dispatch: false })
    signout = this.actions$.pipe(
        ofType(actionTypes.signout),
        tap(() => {
            localStorage.removeItem("tweeter_token");
            localStorage.removeItem("tweeter_user");
            localStorage.removeItem("tweeter_token_exp_date");
            this.router.navigate(["/signin"]);
            window.location.reload();
        })
    );

    @Effect()
    signup = this.actions$.pipe(
        ofType(actionTypes.signup),
        switchMap((action: Action & IPayloadedAction<SignUpData>) => {
            return this.authApi.signUp(action.payload)
                .pipe(
                    mergeMap((res: ApiResponse<boolean>) => {
                        if (!res.errors.length) {
                            return [actionCreators.signupSuccess()];
                        }
                        this.notification.error("Error", res.errors[0]);
                        return [actionCreators.signupError()];
                    }),
                    catchError(() => {
                        this.notification.error("Error", "Error while creating new account");
                        return [actionCreators.signupError()];
                    })
                );
        })
    );

    @Effect({ dispatch: false })
    signupSuccess = this.actions$.pipe(
        ofType(actionTypes.signupSuccess),
        tap(() => {
            this.notification.success("Success", "New account has been created");
            this.router.navigate(["/signin"]);
        })
    );
}
