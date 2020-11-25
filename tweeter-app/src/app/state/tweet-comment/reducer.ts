import { Action } from "@ngrx/store";
import { createSelector } from '@ngrx/store';

import { IAppState } from '..';
import { ApiPageResponse } from '../../models/Api';
import { IPayloadedAction } from '../../models/Common';
import { Tweet } from '../../models/Tweet';
import { TweetComment } from '../../models/TweetComment';
import { actionTypes as tweetActionTypes } from "../tweet/actions";
import { actionTypes } from "./actions";

export interface ITweetComments {
    [tweetId: number]: { comments: TweetComment[], totalCount: number };
}

export interface ITweetCommentState {
    home: ITweetComments;
    explore: ITweetComments;
    bookmarks: ITweetComments;
}

const initialState: ITweetCommentState = {
    home: {},
    explore: {},
    bookmarks: {},
};

const reducerMap = {
    [actionTypes.searchSuccess]: (
        state: ITweetCommentState,
        action: Action & IPayloadedAction<{ res: ApiPageResponse<TweetComment>, feedKey: string, tweetId: number }>
    ): ITweetCommentState => {
        const comments = action.payload.res.items;
        const feedKey = action.payload.feedKey;
        const tweetId = action.payload.tweetId;
        const newState: ITweetCommentState = {
            ...state,
            [feedKey]: { ...state[feedKey] },
        };
        const existingComments: TweetComment[] = newState[feedKey][tweetId].comments;
        newState[feedKey][tweetId] = { comments: [...existingComments, ...comments] };
        return newState;
    },

    [actionTypes.createSuccess]
        : (
            state: ITweetCommentState,
            action: Action & IPayloadedAction<{ comment: TweetComment, feedKey: string }>
        ): ITweetCommentState => {
            const comment = action.payload.comment;
            const feedKey = action.payload.feedKey;
            const newState: ITweetCommentState = {
                ...state,
                [feedKey]: { ...state[feedKey] },
            };
            const existingComments: TweetComment[] = newState[feedKey][comment.tweetId].comments;
            newState[feedKey][comment.tweetId] = { comments: [comment, ...existingComments] };
            return newState;
        },

    [actionTypes.likeSuccess]
        : (
            state: ITweetCommentState,
            action: Action & IPayloadedAction<{ commentId: number, feedKey: string, tweetId: number }>
        ): ITweetCommentState => {
            const commentId = action.payload.commentId;
            const tweetId = action.payload.tweetId;
            const feedKey = action.payload.feedKey;
            const comments = state[feedKey][tweetId].comments.map((c: TweetComment): TweetComment => {
                return c.id === commentId ? { ...c, isLikedByCurrentUser: true, likeCount: c.likeCount + 1 } : c;
            });
            return {
                ...state,
                [feedKey]: {
                    ...state[feedKey],
                    [tweetId]: { ...state[feedKey][tweetId], comments },
                },
            };
        },

    [tweetActionTypes.searchSuccess]
        : (
            state: ITweetCommentState,
            action: Action & IPayloadedAction<{ res: ApiPageResponse<Tweet>, feedKey: string, append: boolean }>
        ): ITweetCommentState => {
            const tweets = action.payload.res.items;
            const feedKey = action.payload.feedKey;

            const newState: ITweetCommentState = {
                ...state,
                [feedKey]: { ...state[feedKey] },
            };

            for (const t of tweets) {
                if (t.retweetedFromId) {
                    newState[feedKey][t.retweetedFromId] =
                        { comments: t.originalTweet.tweetComments, totalCount: t.originalTweet.commentCount };
                } else {
                    newState[feedKey][t.id] = { comments: t.tweetComments, totalCount: t.commentCount };
                }
            }

            return newState;
        },

    [tweetActionTypes.createSuccess]
        : (
            state: ITweetCommentState,
            action: Action & IPayloadedAction<Tweet>
        ): ITweetCommentState => {
            const tweet = action.payload;

            const newState: ITweetCommentState = {
                ...state,
                home: { ...state.home },
            };

            newState.home[tweet.id] = { comments: [], totalCount: 0 };

            return newState;
        }
};

export function tweetCommentReducer(state: ITweetCommentState = initialState, action: any): ITweetCommentState {
    if (reducerMap[action.type]) {
        return reducerMap[action.type](state, action);
    }
    return state;
}

export const selectFeature = (state: IAppState) => state.tweetComment;
export const selectors = {
    tweetComments: createSelector(
        selectFeature, (state: ITweetCommentState, param: { feedKey: string, tweetId: number }) => {
            return state[param.feedKey] ? state[param.feedKey][param.tweetId] : null;
        }
    ),
};
