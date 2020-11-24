import { Action } from "@ngrx/store";
import { createSelector } from '@ngrx/store';

import { IAppState } from '.';
import { ApiPageResponse } from '../models/Api';
import { IPayloadedAction } from '../models/Common';
import { Tweet, TweetSearchParam } from '../models/Tweet';
import { TweetComment } from '../models/TweetComment';

export interface ITweetFeeds {
    home: { tweets: Tweet[], totalCount: number };
    explore: { tweets: Tweet[], totalCount: number };
    bookmarks: { tweets: Tweet[], totalCount: number };
}

export interface ITweetState {
    tweetFeeds: ITweetFeeds;
}

const initialState: ITweetState = {
    tweetFeeds: {
        home: { tweets: [], totalCount: 0 },
        explore: { tweets: [], totalCount: 0 },
        bookmarks: { tweets: [], totalCount: 0 },
    },
};

export const actionTypes = {
    search: "Tweet/Search",
    searchSuccess: "Tweet/SearchSuccess",
    searchError: "Tweet/SearchError",

    create: "Tweet/Create",
    createSuccess: "Tweet/CreateSuccess",
    createError: "Tweet/CreateError",

    retweet: "Tweet/Retweet",
    retweetSuccess: "Tweet/RetweetSuccess",
    retweetError: "Tweet/RetweetError",

    like: "Tweet/Like",
    likeSuccess: "Tweet/LikeSuccess",
    likeError: "Tweet/LikeError",

    bookmark: "Tweet/Bookmark",
    bookmarkSuccess: "Tweet/BookmarkSuccess",
    bookmarkError: "Tweet/BookmarkError",
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

    retweet: (tweetId: number, feedKey: string): Action & IPayloadedAction<{ tweetId: number, feedKey: string }> => ({
        type: actionTypes.retweet,
        payload: { tweetId, feedKey },
    }),
    retweetSuccess: (tweet: Tweet, feedKey: string): Action & IPayloadedAction<{ tweet: Tweet, feedKey: string }> => ({
        type: actionTypes.retweetSuccess,
        payload: { tweet, feedKey },
    }),
    retweetError: (): Action => ({
        type: actionTypes.retweetError,
    }),

    like: (tweetId: number, feedKey: string): Action & IPayloadedAction<{ tweetId: number, feedKey: string }> => ({
        type: actionTypes.like,
        payload: { tweetId, feedKey },
    }),
    likeSuccess: (tweetId: number, feedKey: string): Action & IPayloadedAction<{ tweetId: number, feedKey: string }> => ({
        type: actionTypes.likeSuccess,
        payload: { tweetId, feedKey },
    }),
    likeError: (): Action => ({
        type: actionTypes.likeError,
    }),

    bookmark: (tweetId: number, feedKey: string): Action & IPayloadedAction<{ tweetId: number, feedKey: string }> => ({
        type: actionTypes.bookmark,
        payload: { tweetId, feedKey },
    }),
    bookmarkSuccess: (tweetId: number, feedKey: string): Action & IPayloadedAction<{ tweetId: number, feedKey: string }> => ({
        type: actionTypes.bookmarkSuccess,
        payload: { tweetId, feedKey },
    }),
    bookmarkError: (): Action => ({
        type: actionTypes.bookmarkError,
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
            tweetFeeds: {
                ...state.tweetFeeds,
                [feedKey]: action.payload.append
                    ? { tweets: [...state.tweetFeeds[feedKey].tweets, ...tweets], totalCount }
                    : { tweets, totalCount }
            }
        };
    },

    [actionTypes.createSuccess]: (state: ITweetState, action: Action & IPayloadedAction<Tweet>): ITweetState => {
        const createdTweet = action.payload;
        return {
            ...state,
            tweetFeeds: {
                ...state.tweetFeeds,
                home: { tweets: [createdTweet, ...state.tweetFeeds.home.tweets], totalCount: state.tweetFeeds.home.totalCount },
            },
        };
    },

    [actionTypes.retweetSuccess]: (
        state: ITweetState,
        action: Action & IPayloadedAction<{ tweet: Tweet, feedKey: string }>
    ): ITweetState => {
        const createdTweet = action.payload.tweet;
        const feedKey = action.payload.feedKey;
        const tweets: Tweet[] = state.tweetFeeds[feedKey].tweets.map((t: Tweet): Tweet => {
            return t.id === createdTweet.retweetedFromId
                ? { ...t, isRetweetedByCurrentUser: true, retweetCount: t.retweetCount + 1 }
                : t;
        });
        if (feedKey === "home") {
            tweets.unshift(createdTweet);
        }

        return {
            ...state,
            tweetFeeds: {
                ...state.tweetFeeds,
                [feedKey]: { ...state.tweetFeeds[feedKey], tweets },
            },
        };
    },

    [actionTypes.likeSuccess]: (
        state: ITweetState,
        action: Action & IPayloadedAction<{ tweetId: number, feedKey: string }>
    ): ITweetState => {
        const tweetId = action.payload.tweetId;
        const feedKey = action.payload.feedKey;
        const tweets = state.tweetFeeds[feedKey].tweets.map((t: Tweet): Tweet => {
            if (t.retweetedFromId === tweetId) {
                return {
                    ...t,
                    originalTweet: { ...t.originalTweet, isLikedByCurrentUser: true, likeCount: t.originalTweet.likeCount + 1 }
                };
            } else if (t.id === tweetId) {
                return { ...t, isLikedByCurrentUser: true, likeCount: t.likeCount + 1 };
            }
            return t;
        });

        return {
            ...state,
            tweetFeeds: {
                ...state.tweetFeeds,
                [feedKey]: { ...state.tweetFeeds[feedKey], tweets }
            },
        };
    },

    [actionTypes.bookmarkSuccess]: (
        state: ITweetState,
        action: Action & IPayloadedAction<{ tweetId: number, feedKey: string }>
    ): ITweetState => {
        const tweetId = action.payload.tweetId;
        const feedKey = action.payload.feedKey;
        const tweets = state.tweetFeeds[feedKey].tweets.map((t: Tweet): Tweet => {
            if (t.retweetedFromId === tweetId) {
                return {
                    ...t,
                    originalTweet: { ...t.originalTweet, isBookmarkedByCurrentUser: true, bookmarkCount: t.originalTweet.bookmarkCount + 1 }
                };
            } else if (t.id === tweetId) {
                return { ...t, isBookmarkedByCurrentUser: true, bookmarkCount: t.bookmarkCount + 1 };
            }
            return t;
        });

        return {
            ...state,
            tweetFeeds: {
                ...state.tweetFeeds,
                [feedKey]: { ...state.tweetFeeds[feedKey], tweets }
            },
        };
    },

    ["TweetComment/CreateSuccess"]: (
        state: ITweetState,
        action: Action & IPayloadedAction<{ comment: TweetComment, feedKey: string }>
    ): ITweetState => {
        const tweetId = action.payload.comment.tweetId;
        const feedKey = action.payload.feedKey;
        const tweets = state.tweetFeeds[feedKey].tweets.map((t: Tweet): Tweet => {
            if (t.retweetedFromId === tweetId) {
                return {
                    ...t,
                    originalTweet: { ...t.originalTweet, commentCount: t.originalTweet.commentCount + 1 }
                };
            } else if (t.id === tweetId) {
                return { ...t, commentCount: t.commentCount + 1 };
            }
            return t;
        });

        return {
            ...state,
            tweetFeeds: {
                ...state.tweetFeeds,
                [feedKey]: { ...state.tweetFeeds[feedKey], tweets }
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
    feed: createSelector(selectFeature, (state: ITweetState, feedKey: string) => state.tweetFeeds[feedKey]),
};
