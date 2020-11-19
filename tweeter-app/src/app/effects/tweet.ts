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
        switchMap((action: Action & IPayloadedAction<{ param: TweetSearchParam, tweetListStoreKey: string }>) => {
            return this.tweetApi.search(action.payload.param)
                .pipe(
                    mergeMap((res: ApiPageResponse<Tweet>) => {
                        if (!res.errors.length) {
                            return [actionCreators.searchSuccess(
                                res,
                                action.payload.tweetListStoreKey,
                                action.payload.param.appendToExistingStorePage
                            )];
                        }
                        this.notification.error(res.errors);
                        return [actionCreators.searchError(action.payload.tweetListStoreKey)];
                    }),
                    catchError(() => {
                        this.notification.error();
                        return [actionCreators.searchError(action.payload.tweetListStoreKey)];
                    })
                );
        })
    );
}
