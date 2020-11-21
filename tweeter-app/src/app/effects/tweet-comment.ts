import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action, Store } from '@ngrx/store';
import { catchError, mergeMap, switchMap, tap } from 'rxjs/operators';

import { ApiPageResponse, ApiResponse } from '../models/Api';
import { IPayloadedAction } from '../models/Common';
import { Tweet, TweetSearchParam } from '../models/Tweet';
import { TweetComment, TweetCommentSearchParam } from '../models/TweetComment';
import { TweetApiClient } from '../services/api/tweet-api-client.service';
import { TweetCommentApiClient } from '../services/api/tweet-comment-api-client.service';
import { NotificationService } from '../services/utils/notification.service';
import { IAppState } from '../state';
import { actionCreators, actionTypes } from '../state/tweet-comment';

@Injectable()
export class TweetCommentEffects {
    constructor(
        private actions$: Actions,
        private commentApi: TweetCommentApiClient,
        private router: Router,
        private store: Store<IAppState>,
        private notification: NotificationService
    ) { }

    @Effect()
    search = this.actions$.pipe(
        ofType(actionTypes.search),
        switchMap((action: Action & IPayloadedAction<{ param: TweetCommentSearchParam, feedKey: string }>) => {
            return this.commentApi.search(action.payload.param)
                .pipe(
                    mergeMap((res: ApiPageResponse<TweetComment>) => {
                        if (!res.errors.length) {
                            return [actionCreators.searchSuccess(
                                res,
                                action.payload.feedKey,
                                action.payload.param.tweetId
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
        switchMap((action: Action & IPayloadedAction<{ comment: TweetComment, feedKey: string }>) => {
            return this.commentApi.create(action.payload.comment)
                .pipe(
                    mergeMap((res: ApiResponse<TweetComment>) => {
                        if (!res.errors.length) {
                            return [actionCreators.createSuccess(res.item, action.payload.feedKey)];
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
}
