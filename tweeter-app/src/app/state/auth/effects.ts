import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action, Store } from '@ngrx/store';
import { catchError, mergeMap, switchMap, tap } from 'rxjs/operators';

import { ApiResponse } from '../../models/Api';
import { SigninResult, SignUpData } from '../../models/Auth';
import { IPayloadedAction } from '../../models/Common';
import { AuthApiClient } from '../../services/api/auth-api-client.service';
import { NotificationService } from '../../services/utils/notification.service';
import { IAppState } from '../../state';
import { actionCreators, actionTypes } from './actions';

@Injectable()
export class AuthEffects {
    private readonly minutes55AsMs = 3300000;
    private readonly minutes60AsMs = 3600000;

    constructor(
        private actions$: Actions,
        private authApi: AuthApiClient,
        private router: Router,
        private store: Store<IAppState>,
        private notification: NotificationService
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
                            localStorage.setItem("tweeter_token_exp_date", (new Date().getTime() + this.minutes60AsMs).toString());
                            return [actionCreators.signinSuccess(res.item), actionCreators.autoSignout(this.minutes55AsMs)];
                        }
                        this.notification.error(res.errors);
                        return [actionCreators.signinError()];
                    }),
                    catchError(() => {
                        this.notification.error();
                        return [actionCreators.signinError()];
                    })
                );
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
                            this.notification.success(["New account has been created"]);
                            return [actionCreators.signupSuccess()];
                        }
                        this.notification.error(res.errors);
                        return [actionCreators.signupError()];
                    }),
                    catchError(() => {
                        this.notification.error();
                        return [actionCreators.signupError()];
                    })
                );
        })
    );

    @Effect()
    autoSignin = this.actions$.pipe(
        ofType(actionTypes.autoSignin),
        mergeMap(() => {
            const token = localStorage.getItem("tweeter_token");
            const user = JSON.parse(localStorage.getItem("tweeter_user"));
            const expDate = Number(localStorage.getItem("tweeter_token_exp_date"));
            const now = new Date().getTime();
            if (token  && user && expDate && expDate > now) {
                const signinRes = new SigninResult();
                signinRes.token = token;
                signinRes.user = user;
                return [actionCreators.autoSigninSuccess(signinRes), actionCreators.autoSignout(expDate - now)];
            }
            this.clearLocalStorage();
            return [actionCreators.autoSigninError()];
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

    @Effect({ dispatch: false })
    signout = this.actions$.pipe(
        ofType(actionTypes.signout),
        tap(() => {
            this.clearLocalStorage();
            window.location.reload();
        })
    );

    private clearLocalStorage(): void {
        localStorage.removeItem("tweeter_token");
        localStorage.removeItem("tweeter_user");
        localStorage.removeItem("tweeter_token_exp_date");
    }
}
