import { Action } from "@ngrx/store";
import { createSelector } from '@ngrx/store';

import { IAppState } from '.';
import { ApiPageResponse } from '../models/Api';
import { IPayloadedAction } from '../models/Common';
import { Tweet, TweetSearchParam } from '../models/Tweet';

export interface ITweetFeed {
    home: { tweets: Tweet[], totalCount: number };
    explore: { tweets: Tweet[], totalCount: number };
    bookmarks: { tweets: Tweet[], totalCount: number };
}

export interface ITweetState {
    tweetFeed: ITweetFeed;
}

const initialState: ITweetState = {
    tweetFeed: {
        home: null,
        explore: null,
        bookmarks: null
    },
};

export const actionTypes = {
    search: "Tweet/Search",
    searchSuccess: "Tweet/SearchSuccess",
    searchError: "Tweet/SearchError",

    create: "Tweet/Create",
    createSuccess: "Tweet/CreateSuccess",
    createError: "Tweet/CreateError",
};

export const actionCreators = {
    search: (param: TweetSearchParam, feedKey: string)
        : Action & IPayloadedAction<{ param: TweetSearchParam, feedKey: string }> => ({
            type: actionTypes.search,
            payload: { param, feedKey },
        }),
    searchSuccess: (res: ApiPageResponse<Tweet>, feedKey: string, append: boolean)
        : Action & IPayloadedAction<{ res: ApiPageResponse<Tweet>, feedKey: string, append: boolean }> => ({
            type: actionTypes.searchSuccess,
            payload: { res, feedKey, append }
        }),
    searchError: (feedKey: string): Action & IPayloadedAction<string> => ({
        type: actionTypes.searchError,
        payload: feedKey,
    }),

    create: (tweet: Tweet): Action & IPayloadedAction<Tweet> => ({
        type: actionTypes.create,
        payload: tweet,
    }),
    createSuccess: (tweet: Tweet): Action & IPayloadedAction<Tweet> => ({
        type: actionTypes.createSuccess,
        payload: tweet,
    }),
    createError: (): Action => ({
        type: actionTypes.createError,
    }),
};

const reducerMap = {
    [actionTypes.searchSuccess]: (
        state: ITweetState,
        action: Action & IPayloadedAction<{ res: ApiPageResponse<Tweet>, feedKey: string, append: boolean }>
    ): ITweetState => {
        const feedKey = action.payload.feedKey;
        const tweets = action.payload.res.items;
        const totalCount = action.payload.res.totalCount;
        return {
            ...state,
            tweetFeed: {
                ...state.tweetFeed,
                [feedKey]: action.payload.append
                    ? { tweets: [...state.tweetFeed[feedKey].tweets, ...tweets], totalCount }
                    : { tweets, totalCount }
            }
        };
    },

    [actionTypes.createSuccess]: (state: ITweetState, action: Action & IPayloadedAction<Tweet>): ITweetState => {
        const createdTweet = action.payload;
        return {
            ...state,
            tweetFeed: {
                ...state.tweetFeed,
                home: { tweets: [createdTweet, ...state.tweetFeed.home.tweets], totalCount: state.tweetFeed.home.totalCount },
            },
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
    feed: createSelector(selectFeature, (state: ITweetState, feedKey: string) => state.tweetFeed[feedKey]),
};
