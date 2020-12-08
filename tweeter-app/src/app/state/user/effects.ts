import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action, Store } from '@ngrx/store';
import { catchError, mergeMap, switchMap, tap } from 'rxjs/operators';
import { User, UserSearchParam } from 'src/app/models/User';
import { UserApiClient } from 'src/app/services/api/user-api-client.service';

import { ApiPageResponse, ApiResponse } from '../../models/Api';
import { IPayloadedAction } from '../../models/Common';
import { NotificationService } from '../../services/utils/notification.service';
import { IAppState } from '../../state';
import { actionCreators, actionTypes } from './actions';

@Injectable()
export class UserEffects {
    constructor(
        private actions$: Actions,
        private userApi: UserApiClient,
        private router: Router,
        private store: Store<IAppState>,
        private notification: NotificationService
    ) { }

    @Effect()
    search = this.actions$.pipe(
        ofType(actionTypes.search),
        switchMap((action: Action & IPayloadedAction<{ param: UserSearchParam, listKey: string }>) => {
            return this.userApi.search(action.payload.param)
                .pipe(
                    mergeMap((res: ApiPageResponse<User>) => {
                        if (!res.errors.length) {
                            return [actionCreators.searchSuccess(
                                res,
                                action.payload.listKey,
                                action.payload.param.appendToExistingStorePage
                            )];
                        }
                        this.notification.error(res.errors);
                        return [actionCreators.searchError()];
                    }),
                    catchError(() => {
                        this.notification.error();
                        return [actionCreators.searchError()];
                    })
                );
        })
    );

    @Effect()
    follow = this.actions$.pipe(
        ofType(actionTypes.follow),
        switchMap((action: Action & IPayloadedAction<{ userId: number, listKey: string, profileId: number }>) => {
            return this.userApi.follow(action.payload.userId)
                .pipe(
                    mergeMap((res: ApiResponse<boolean>) => {
                        if (!res.errors.length) {
                            return [actionCreators.followSuccess(
                                action.payload.userId,
                                action.payload.listKey,
                                action.payload.profileId
                            )];
                        }
                        this.notification.error(res.errors);
                        return [actionCreators.followError()];
                    }),
                    catchError((error) => {
                        this.notification.error();
                        return [actionCreators.followError()];
                    })
                );
        })
    );

    @Effect()
    unfollow = this.actions$.pipe(
        ofType(actionTypes.unfollow),
        switchMap((action: Action & IPayloadedAction<{ userId: number, listKey: string, profileId: number }>) => {
            return this.userApi.unfollow(action.payload.userId)
                .pipe(
                    mergeMap((res: ApiResponse<boolean>) => {
                        if (!res.errors.length) {
                            return [actionCreators.unfollowSuccess(
                                action.payload.userId,
                                action.payload.listKey,
                                action.payload.profileId
                            )];
                        }
                        this.notification.error(res.errors);
                        return [actionCreators.unfollowError()];
                    }),
                    catchError((error) => {
                        this.notification.error();
                        return [actionCreators.unfollowError()];
                    })
                );
        })
    );

    @Effect()
    get = this.actions$.pipe(
        ofType(actionTypes.get),
        switchMap((action: Action & IPayloadedAction<number>) => {
            return this.userApi.get(action.payload)
                .pipe(
                    mergeMap((res: ApiResponse<User>) => {
                        if (!res.errors.length) {
                            return [actionCreators.getSuccess(res.item)];
                        }
                        this.notification.error(res.errors);
                        return [actionCreators.getError()];
                    }),
                    catchError((error) => {
                        this.notification.error();
                        return [actionCreators.getError()];
                    })
                );
        })
    );

    @Effect()
    update = this.actions$.pipe(
        ofType(actionTypes.update),
        switchMap((action: Action & IPayloadedAction<User>) => {
            return this.userApi.update(action.payload)
                .pipe(
                    mergeMap((res: ApiResponse<User>) => {
                        if (!res.errors.length) {
                            localStorage.setItem("tweeter_user", JSON.stringify(res.item));
                            this.notification.success(["User has been updated"]);
                            return [actionCreators.updateSuccess(res.item)];
                        }
                        this.notification.error(res.errors);
                        return [actionCreators.updateError()];
                    }),
                    catchError((error) => {
                        this.notification.error();
                        return [actionCreators.updateError()];
                    })
                );
        })
    );
}
