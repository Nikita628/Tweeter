import { ActionReducerMap } from '@ngrx/store';
import { authReducer, IAuthState } from './auth';
import { ITweetState, tweetReducer } from './tweet';

export interface IAppState {
    auth: IAuthState;
    tweet: ITweetState;
}

export const reducers: ActionReducerMap<IAppState> = {
    auth: authReducer,
    tweet: tweetReducer,
};
