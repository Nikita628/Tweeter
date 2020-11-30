import { ActionReducerMap } from '@ngrx/store';
import { authReducer, IAuthState } from './auth/reducer';
import { IActionStatusesState, actionStatusesReducer } from './action-statuses/reducer';
import { ITweetState, tweetReducer } from './tweet/reducer';
import { ITweetCommentState, tweetCommentReducer } from './tweet-comment/reducer';
import { IUserState, userReducer } from './user/reducer';

export interface IAppState {
    auth: IAuthState;
    tweet: ITweetState;
    tweetComment: ITweetCommentState;
    actionStatuses: IActionStatusesState;
    user: IUserState;
}

export const reducers: ActionReducerMap<IAppState> = {
    auth: authReducer,
    tweet: tweetReducer,
    tweetComment: tweetCommentReducer,
    actionStatuses: actionStatusesReducer,
    user: userReducer,
};
