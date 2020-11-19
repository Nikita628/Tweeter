import { Action, props } from "@ngrx/store";
import { createSelector } from '@ngrx/store';

import { IAppState } from '.';
import { ApiPageResponse } from '../models/Api';
import { IPayloadedAction } from '../models/Common';
import { Tweet, TweetSearchParam } from '../models/Tweet';

export interface ITweetState {
    homeTweets: { tweets: Tweet[], totalCount: number };
}

const initialState: ITweetState = {
    homeTweets: null,
};

export const actionTypes = {
    search: "Tweet/Search",
    searchSuccess: "Tweet/SearchSuccess",
    searchError: "Tweet/SearchError",
};

export const actionCreators = {
    search: (param: TweetSearchParam, tweetListStoreKey: string)
        : Action & IPayloadedAction<{ param: TweetSearchParam, tweetListStoreKey: string }> => ({
            type: actionTypes.search,
            payload: { param, tweetListStoreKey },
        }),
    searchSuccess: (res: ApiPageResponse<Tweet>, tweetListStoreKey: string, append: boolean)
        : Action & IPayloadedAction<{ res: ApiPageResponse<Tweet>, tweetListStoreKey: string, append: boolean }> => ({
            type: actionTypes.searchSuccess,
            payload: { res, tweetListStoreKey, append }
        }),
    searchError: (tweetListStoreKey: string): Action & IPayloadedAction<string> => ({
        type: actionTypes.searchError,
        payload: tweetListStoreKey,
    }),
};

const reducerMap = {
    [actionTypes.searchSuccess]: (
        state: ITweetState,
        action: Action & IPayloadedAction<{ res: ApiPageResponse<Tweet>, tweetListStoreKey: string, append: boolean }>
    ): ITweetState => {
        return {
            ...state,
            [action.payload.tweetListStoreKey]: action.payload.append
                ? { tweets: [ ...state.homeTweets.tweets, ...action.payload.res.items], totalCount: action.payload.res.totalCount }
                : { tweets: action.payload.res.items, totalCount: action.payload.res.totalCount }
        };
    },
    [actionTypes.searchError]: (state: ITweetState, action: Action & IPayloadedAction<string>): ITweetState => {
        return {
            ...state,
            [action.payload]: { tweets: [], totalCount: 0 }
        };
    },
};

export function tweetReducer(state: ITweetState = initialState, action: any): ITweetState {
    if (reducerMap[action.type]) {
        return reducerMap[action.type](state, action);
    }
    return state;
}

export const selectFeature = (state: IAppState) => state.tweet;
export const selectors = {
    selectTweetList: createSelector(selectFeature, (state: ITweetState, tweetListStoreKey: string) => state[tweetListStoreKey]),
};
