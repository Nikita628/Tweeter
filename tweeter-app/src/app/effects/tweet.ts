import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action, Store } from '@ngrx/store';
import { catchError, mergeMap, switchMap, tap } from 'rxjs/operators';

import { ApiPageResponse, ApiResponse } from '../models/Api';
import { IPayloadedAction } from '../models/Common';
import { Tweet, TweetSearchParam } from '../models/Tweet';
import { TweetApiClient } from '../services/api/tweet-api-client.service';
import { NotificationService } from '../services/utils/notification.service';
import { IAppState } from '../state';
import { actionCreators, actionTypes } from '../state/tweet';

@Injectable()
export class TweetEffects {
    constructor(
        private actions$: Actions,
        private tweetApi: TweetApiClient,
        private router: Router,
        private store: Store<IAppState>,
        private notification: NotificationService
    ) { }

    @Effect()
    search = this.actions$.pipe(
        ofType(actionTypes.search),
        switchMap((action: Action & IPayloadedAction<{ param: TweetSearchParam, feedKey: string }>) => {
            return this.tweetApi.search(action.payload.param)
                .pipe(
                    mergeMap((res: ApiPageResponse<Tweet>) => {
                        if (!res.errors.length) {
                            return [actionCreators.searchSuccess(
                                res,
                                action.payload.feedKey,
                                action.payload.param.appendToExistingStorePage
                            )];
                        }
                        this.notification.error(res.errors);
                        return [actionCreators.searchError(action.payload.feedKey)];
                    }),
                    catchError(() => {
                        this.notification.error();
                        return [actionCreators.searchError(action.payload.feedKey)];
                    })
                );
        })
    );

    @Effect()
    create = this.actions$.pipe(
        ofType(actionTypes.create),
        switchMap((action: Action & IPayloadedAction<Tweet>) => {
            return this.tweetApi.create(action.payload)
                .pipe(
                    mergeMap((res: ApiResponse<Tweet>) => {
                        if (!res.errors.length) {
                            return [actionCreators.createSuccess(res.item)];
                        }
                        this.notification.error(res.errors);
                        return [actionCreators.createError()];
                    }),
                    catchError((error) => {
                        this.notification.error();
                        return [actionCreators.createError()];
                    })
                );
        })
    );

    @Effect()
    retweet = this.actions$.pipe(
        ofType(actionTypes.retweet),
        switchMap((action: Action & IPayloadedAction<{ tweetId: number, feedKey: string }>) => {
            return this.tweetApi.retweet(action.payload.tweetId)
                .pipe(
                    mergeMap((res: ApiResponse<Tweet>) => {
                        if (!res.errors.length) {
                            return [actionCreators.retweetSuccess(res.item, action.payload.feedKey)];
                        }
                        this.notification.error(res.errors);
                        return [actionCreators.retweetError()];
                    }),
                    catchError((error) => {
                        this.notification.error();
                        return [actionCreators.retweetError()];
                    })
                );
        })
    );

    @Effect()
    like = this.actions$.pipe(
        ofType(actionTypes.like),
        switchMap((action: Action & IPayloadedAction<{ tweetId: number, feedKey: string }>) => {
            return this.tweetApi.like(action.payload.tweetId)
                .pipe(
                    mergeMap((res: ApiResponse<boolean>) => {
                        if (!res.errors.length) {
                            return [actionCreators.likeSuccess(action.payload.tweetId, action.payload.feedKey)];
                        }
                        this.notification.error(res.errors);
                        return [actionCreators.likeError()];
                    }),
                    catchError((error) => {
                        this.notification.error();
                        return [actionCreators.likeError()];
                    })
                );
        })
    );

    @Effect()
    bookmark = this.actions$.pipe(
        ofType(actionTypes.bookmark),
        switchMap((action: Action & IPayloadedAction<{ tweetId: number, feedKey: string }>) => {
            return this.tweetApi.bookmark(action.payload.tweetId)
                .pipe(
                    mergeMap((res: ApiResponse<boolean>) => {
                        if (!res.errors.length) {
                            return [actionCreators.bookmarkSuccess(action.payload.tweetId, action.payload.feedKey)];
                        }
                        this.notification.error(res.errors);
                        return [actionCreators.bookmarkError()];
                    }),
                    catchError((error) => {
                        this.notification.error();
                        return [actionCreators.bookmarkError()];
                    })
                );
        })
    );
}
