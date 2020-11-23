import { ActionReducerMap } from '@ngrx/store';
import { authReducer, IAuthState } from './auth';
import { ICommonState, commonReducer } from './common';
import { ITweetState, tweetReducer } from './tweet';
import { ITweetCommentState, tweetCommentReducer } from './tweet-comment';

export interface IAppState {
    auth: IAuthState;
    tweet: ITweetState;
    tweetComment: ITweetCommentState;
    common: ICommonState;
}

export const reducers: ActionReducerMap<IAppState> = {
    auth: authReducer,
    tweet: tweetReducer,
    tweetComment: tweetCommentReducer,
    common: commonReducer,
};
