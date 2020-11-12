import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action, Store } from '@ngrx/store';
import { catchError, mergeMap, switchMap, tap } from 'rxjs/operators';

import { ApiResponse } from '../models/Api';
import { SigninResult } from '../models/Auth';
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
        private store: Store<IAppState>
    ) { }

    @Effect()
    signin = this.actions$.pipe(
        ofType(actionTypes.signin),
        switchMap((action: Action & IPayloadedAction<{ email: string, password: string }>) => {
            return this.authApi.signIn(action.payload.email, action.payload.password)
                .pipe(
                    mergeMap((res: ApiResponse<SigninResult>) => {
                        if (res.errors.length) {
                            return [actionCreators.signinError()];
                        }
                        localStorage.setItem("tweeter_token", res.item.token);
                        localStorage.setItem("tweeter_user", JSON.stringify(res.item.user));
                        const hourFromNow = new Date().getTime() + 3600000;
                        localStorage.setItem("tweeter_token_exp_date", hourFromNow.toString());
                        return [actionCreators.signinSuccess(res.item), actionCreators.autoSignout(3300000)];
                    }),
                    catchError(() => {
                        // display error notification
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

    @Effect({ dispatch: false })
    signinSuccess = this.actions$.pipe(
        ofType(actionTypes.signinSuccess),
        tap(() => {
            this.router.navigate(["/"]);
        })
    );

    @Effect({ dispatch: false })
    signout = this.actions$.pipe(
        ofType(actionTypes.signout),
        tap(() => {
            localStorage.removeItem("tweeter_token");
            localStorage.removeItem("tweeter_user");
            localStorage.removeItem("tweeter_token_exp_date");
            this.router.navigate(["/"]);
            window.location.reload();
        })
    );
}
