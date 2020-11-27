import { ActionReducerMap } from '@ngrx/store';
import { authReducer, IAuthState } from './auth/reducer';
import { ICommonState, commonReducer } from './common/reducer';
import { ITweetState, tweetReducer } from './tweet/reducer';
import { ITweetCommentState, tweetCommentReducer } from './tweet-comment/reducer';
import { IUserState, userReducer } from './user/reducer';

export interface IAppState {
    auth: IAuthState;
    tweet: ITweetState;
    tweetComment: ITweetCommentState;
    common: ICommonState;
    user: IUserState;
}

export const reducers: ActionReducerMap<IAppState> = {
    auth: authReducer,
    tweet: tweetReducer,
    tweetComment: tweetCommentReducer,
    common: commonReducer,
    user: userReducer,
};
