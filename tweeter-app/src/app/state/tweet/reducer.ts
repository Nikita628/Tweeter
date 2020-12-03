import { Action } from "@ngrx/store";
import { createSelector } from '@ngrx/store';

import { IAppState } from '..';
import { ApiPageResponse } from '../../models/Api';
import { IPayloadedAction } from '../../models/Common';
import { Tweet } from '../../models/Tweet';
import { TweetComment } from '../../models/TweetComment';
import { actionTypes } from "./actions";
import { actionTypes as tweetCommentAT } from "../tweet-comment/actions";
import { HashTag } from 'src/app/models/HashTag';

export interface ITweetFeeds {
    home: { tweets: Tweet[], totalCount: number };
    explore: { tweets: Tweet[], totalCount: number };
    bookmarks: { tweets: Tweet[], totalCount: number };
    profile: { tweets: Tweet[], totalCount: number };
}

export interface ITweetState {
    tweetFeeds: ITweetFeeds;
    hashtags: HashTag[];
}

const initialState: ITweetState = {
    tweetFeeds: {
        home: { tweets: [], totalCount: 0 },
        explore: { tweets: [], totalCount: 0 },
        bookmarks: { tweets: [], totalCount: 0 },
        profile: { tweets: [], totalCount: 0 },
    },
    hashtags: [],
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

    [tweetCommentAT.createSuccess]: (
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

    [actionTypes.searchHashtagsSuccess]: (
        state: ITweetState,
        action: Action & IPayloadedAction<ApiPageResponse<HashTag>>
    ): ITweetState => {
        const hashtags = action.payload.items;
        return {
            ...state,
            hashtags,
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
    hashtags: createSelector(selectFeature, (state: ITweetState) => state.hashtags),
};
